import { UserRole } from '../config/auth';

export interface AuthUser {
  id: number;
  employeeId?: string;
  email?: string;
  name?: string;
  role: Exclude<UserRole, 'guest'>;
  provider?: string;
}

export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  details?: unknown;
  correlationId?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
