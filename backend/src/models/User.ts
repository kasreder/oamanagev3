import { UserRole } from '../config/auth';

export type SocialProvider = 'kakao' | 'naver' | 'google' | 'teams';

export interface User {
  id: number;
  employeeId: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: Exclude<UserRole, 'guest'>;
  provider: SocialProvider | null;
  providerId: string | null;
  departmentHq: string | null;
  departmentDept: string | null;
  departmentTeam: string | null;
  departmentPart: string | null;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  employeeId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role?: Exclude<UserRole, 'guest'>;
  provider?: SocialProvider;
  providerId?: string;
  departmentHq?: string | null;
  departmentDept?: string | null;
  departmentTeam?: string | null;
  departmentPart?: string | null;
  isActive?: boolean;
}

export interface UpdateUserInput {
  name?: string;
  email?: string | null;
  phone?: string | null;
  role?: Exclude<UserRole, 'guest'>;
  provider?: SocialProvider | null;
  providerId?: string | null;
  departmentHq?: string | null;
  departmentDept?: string | null;
  departmentTeam?: string | null;
  departmentPart?: string | null;
  isActive?: boolean;
  lastLoginAt?: Date | null;
}

export interface RefreshToken {
  id: number;
  userId: number;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface SocialProfile {
  id: string;
  email?: string;
  name?: string;
}
