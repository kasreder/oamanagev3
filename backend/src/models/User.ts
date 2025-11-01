export type UserProvider = 'kakao' | 'naver' | 'google' | 'teams' | null;

export interface User {
  id: number;
  employeeId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  provider: UserProvider;
  providerId?: string | null;
  departmentHq?: string | null;
  departmentDept?: string | null;
  departmentTeam?: string | null;
  departmentPart?: string | null;
  role: 'guest' | 'user' | 'admin';
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UserSummary = Pick<User, 'id' | 'name' | 'email'>;
