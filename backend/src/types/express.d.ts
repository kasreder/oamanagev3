import type { User } from '@/types/domain';

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, 'id' | 'name' | 'provider'>;
    }
  }
}
export {};
