import { RowDataPacket } from 'mysql2/promise';

import { getPool } from '@/config/database';
import { RefreshToken } from '@/models/RefreshToken';

interface RefreshTokenRow extends RowDataPacket {
  id: number;
  user_id: number;
  token: string;
  expires_at: string;
  created_at: string;
}

const mapToken = (row: RefreshTokenRow): RefreshToken => ({
  id: row.id,
  userId: row.user_id,
  token: row.token,
  expiresAt: row.expires_at,
  createdAt: row.created_at,
});

export class RefreshTokenRepository {
  async create(token: Omit<RefreshToken, 'id' | 'createdAt'>): Promise<void> {
    await getPool().query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (:userId, :token, :expiresAt)`,
      {
        userId: token.userId,
        token: token.token,
        expiresAt: token.expiresAt,
      }

    );
  }

  async deleteByToken(token: string): Promise<void> {
    await getPool().query(`DELETE FROM refresh_tokens WHERE token = :token`, { token });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const [rows] = await getPool().query<RefreshTokenRow[]>(
      `SELECT * FROM refresh_tokens WHERE token = :token LIMIT 1`,
      { token }
    );

    return rows[0] ? mapToken(rows[0]) : null;
  }

  async deleteByUserId(userId: number): Promise<void> {
    await getPool().query(`DELETE FROM refresh_tokens WHERE user_id = :userId`, { userId });
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();
