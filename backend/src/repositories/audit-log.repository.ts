import { RowDataPacket } from 'mysql2/promise';

import { getPool } from '@/config/database';
import { AuditLog } from '@/models/AuditLog';

interface AuditLogRow extends RowDataPacket {
  id: number;
  user_id: number | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  changes: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

const mapAuditLog = (row: AuditLogRow): AuditLog => ({
  id: row.id,
  userId: row.user_id ?? undefined,
  action: row.action,
  resourceType: row.resource_type,
  resourceId: row.resource_id ?? undefined,
  changes: row.changes ? (JSON.parse(row.changes) as Record<string, unknown>) : undefined,
  ipAddress: row.ip_address ?? undefined,
  userAgent: row.user_agent ?? undefined,
  createdAt: row.created_at,
});

export class AuditLogRepository {
  async create(log: Omit<AuditLog, 'id' | 'createdAt'>): Promise<void> {
    await getPool().query(
      `INSERT INTO audit_logs (
        user_id, action, resource_type, resource_id, changes, ip_address, user_agent
      ) VALUES (
        :userId, :action, :resourceType, :resourceId, :changes, :ipAddress, :userAgent
      )`,
      {
        userId: log.userId ?? null,
        action: log.action,
        resourceType: log.resourceType,
        resourceId: log.resourceId ?? null,
        changes: log.changes ? JSON.stringify(log.changes) : null,
        ipAddress: log.ipAddress ?? null,
        userAgent: log.userAgent ?? null,
      }
    );
  }

  async findRecent(limit = 50): Promise<AuditLog[]> {
    const [rows] = await getPool().query<AuditLogRow[]>(
      `SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT :limit` as string,
      { limit }
    );

    return rows.map(mapAuditLog);
  }
}

export const auditLogRepository = new AuditLogRepository();
