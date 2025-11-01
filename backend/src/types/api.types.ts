export type UserRole = 'guest' | 'user' | 'admin';

export interface AuthenticatedUser {
  id: number;
  employeeId: string;
  email?: string;
  name?: string;
  role: UserRole;
  permissions?: string[];
  tokenVersion?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
