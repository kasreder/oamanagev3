import { auditLogRepository } from '@/repositories/audit-log.repository';
import { AuditLog } from '@/models/AuditLog';

export class AuditService {
  async record(log: Omit<AuditLog, 'id' | 'createdAt'>): Promise<void> {
    await auditLogRepository.create(log);
  }

  async getRecent(limit?: number): Promise<AuditLog[]> {
    return auditLogRepository.findRecent(limit);
  }
}

export const auditService = new AuditService();
