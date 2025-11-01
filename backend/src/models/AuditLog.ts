export interface AuditLog {
  id: number;
  userId?: number | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  changes?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}
