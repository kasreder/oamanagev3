import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { db } from '../config/database';
import { HttpError } from '../middlewares/error.middleware';
import { CreateUserInput, RefreshToken, UpdateUserInput, User } from '../models/User';

interface UserRow extends RowDataPacket {
  id: number;
  employee_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  provider: string | null;
  provider_id: string | null;
  department_hq: string | null;
  department_dept: string | null;
  department_team: string | null;
  department_part: string | null;
  is_active: number;
  last_login_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

interface RefreshTokenRow extends RowDataPacket {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
  created_at: Date;
}

const mapUserRow = (row: UserRow): User => ({
  id: row.id,
  employeeId: row.employee_id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  role: row.role as User['role'],
  provider: row.provider as User['provider'],
  providerId: row.provider_id,
  departmentHq: row.department_hq,
  departmentDept: row.department_dept,
  departmentTeam: row.department_team,
  departmentPart: row.department_part,
  isActive: !!row.is_active,
  lastLoginAt: row.last_login_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapRefreshTokenRow = (row: RefreshTokenRow): RefreshToken => ({
  id: row.id,
  userId: row.user_id,
  token: row.token,
  expiresAt: row.expires_at,
  createdAt: row.created_at,
});

export const findById = async (id: number): Promise<User | null> => {
  const [rows] = await db.query<UserRow[]>(`SELECT * FROM users WHERE id = ? LIMIT 1`, [id]);
  if (!rows.length) {
    return null;
  }

  return mapUserRow(rows[0]);
};

export const findByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await db.query<UserRow[]>(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email]);
  if (!rows.length) {
    return null;
  }

  return mapUserRow(rows[0]);
};

export const findByProvider = async (
  provider: NonNullable<User['provider']>,
  providerId: string,
): Promise<User | null> => {
  const [rows] = await db.query<UserRow[]>(
    `SELECT * FROM users WHERE provider = ? AND provider_id = ? LIMIT 1`,
    [provider, providerId],
  );

  if (!rows.length) {
    return null;
  }

  return mapUserRow(rows[0]);
};

export const createUser = async (payload: CreateUserInput): Promise<User> => {
  try {
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO users (
        employee_id,
        name,
        email,
        phone,
        role,
        provider,
        provider_id,
        department_hq,
        department_dept,
        department_team,
        department_part,
        is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.employeeId,
        payload.name,
        payload.email ?? null,
        payload.phone ?? null,
        payload.role ?? 'user',
        payload.provider ?? null,
        payload.providerId ?? null,
        payload.departmentHq ?? null,
        payload.departmentDept ?? null,
        payload.departmentTeam ?? null,
        payload.departmentPart ?? null,
        payload.isActive ?? true,
      ],
    );

    const created = await findById(result.insertId);
    if (!created) {
      throw new HttpError(500, '사용자 생성에 실패했습니다.', 'USER_CREATE_FAILED');
    }

    return created;
  } catch (error) {
    const err = error as NodeJS.ErrnoException & { code?: string };
    if (err.code === 'ER_DUP_ENTRY') {
      throw new HttpError(409, '이미 존재하는 사용자입니다.', 'USER_DUPLICATED', err.message);
    }

    throw error;
  }
};

export const updateUser = async (id: number, payload: UpdateUserInput): Promise<User | null> => {
  const fields: string[] = [];
  const values: unknown[] = [];

  const entries = Object.entries(payload) as [
    keyof UpdateUserInput,
    UpdateUserInput[keyof UpdateUserInput],
  ][];
  for (const [key, value] of entries) {
    if (typeof value === 'undefined') {
      continue;
    }

    const column = key
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^provider$/, 'provider')
      .replace(/^provider_id$/, 'provider_id');

    fields.push(`${column} = ?`);
    values.push(value instanceof Date ? value : (value ?? null));
  }

  if (!fields.length) {
    return findById(id);
  }

  values.push(id);

  await db.query<ResultSetHeader>(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);

  return findById(id);
};

export const updateLastLogin = async (id: number): Promise<void> => {
  await db.query(`UPDATE users SET last_login_at = NOW() WHERE id = ?`, [id]);
};

export const saveRefreshToken = async (
  userId: number,
  token: string,
  expiresAt: Date,
): Promise<RefreshToken> => {
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)`,
    [userId, token, expiresAt],
  );

  return {
    id: result.insertId,
    userId,
    token,
    expiresAt,
    createdAt: new Date(),
  };
};

export const findRefreshToken = async (token: string): Promise<RefreshToken | null> => {
  const [rows] = await db.query<RefreshTokenRow[]>(
    `SELECT * FROM refresh_tokens WHERE token = ? LIMIT 1`,
    [token],
  );

  if (!rows.length) {
    return null;
  }

  return mapRefreshTokenRow(rows[0]);
};

export const deleteRefreshToken = async (token: string): Promise<void> => {
  await db.query(`DELETE FROM refresh_tokens WHERE token = ?`, [token]);
};

export const deleteRefreshTokensByUserId = async (userId: number): Promise<void> => {
  await db.query(`DELETE FROM refresh_tokens WHERE user_id = ?`, [userId]);
};

export const purgeExpiredRefreshTokens = async (): Promise<void> => {
  await db.query(`DELETE FROM refresh_tokens WHERE expires_at <= NOW()`);
};

export default {
  findById,
  findByEmail,
  findByProvider,
  createUser,
  updateUser,
  updateLastLogin,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  deleteRefreshTokensByUserId,
  purgeExpiredRefreshTokens,
};
