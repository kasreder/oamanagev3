import type { AuthenticatedUser } from '@/types/api.types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
