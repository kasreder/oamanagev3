import { AuthUser } from '../api.types';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
    correlationId?: string;
  }
}

export {};
