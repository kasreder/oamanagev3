import 'express-serve-static-core';

import { AuthUser } from './api.types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      correlationId?: string;
    }
  }
}

export {};
