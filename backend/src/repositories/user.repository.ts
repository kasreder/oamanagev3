import { RowDataPacket } from 'mysql2/promise';

import { getPool } from '@/config/database';
import { User } from '@/models/User';

interface UserRow extends RowDataPacket {
  id: number;
  employee_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  provider: string | null;
  provider_id: string | null;
  department_hq: string | null;
  department_dept: string | null;
  department_team: string | null;
  department_part: string | null;
  role: string;
  is_active: number;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

const mapUser = (row: UserRow): User => ({
  id: row.id,
  employeeId: row.employee_id,
  name: row.name,
  email: row.email ?? undefined,
  phone: row.phone ?? undefined,
  provider: (row.provider as User['provider']) ?? null,
  providerId: row.provider_id ?? undefined,
  departmentHq: row.department_hq ?? undefined,
  departmentDept: row.department_dept ?? undefined,
  departmentTeam: row.department_team ?? undefined,
  departmentPart: row.department_part ?? undefined,
  role: row.role as User['role'],
  isActive: Boolean(row.is_active),
  lastLoginAt: row.last_login_at ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export class UserRepository {
  async findById(id: number): Promise<User | null> {
    const [rows] = await getPool().query<UserRow[]>(
      `SELECT * FROM users WHERE id = :id LIMIT 1`,
      { id }
    );

    return rows[0] ? mapUser(rows[0]) : null;
  }

  async findByEmployeeId(employeeId: string): Promise<User | null> {
    const [rows] = await getPool().query<UserRow[]>(
      `SELECT * FROM users WHERE employee_id = :employeeId LIMIT 1`,
      { employeeId }
    );

    return rows[0] ? mapUser(rows[0]) : null;
  }

  async findByProvider(provider: string, providerId: string): Promise<User | null> {
    const [rows] = await getPool().query<UserRow[]>(
      `SELECT * FROM users WHERE provider = :provider AND provider_id = :providerId LIMIT 1`,
      { provider, providerId }
    );

    return rows[0] ? mapUser(rows[0]) : null;
  }

  async updateLastLogin(id: number): Promise<void> {
    await getPool().query(
      `UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = :id`,
      { id }
    );
  }
}

export const userRepository = new UserRepository();
