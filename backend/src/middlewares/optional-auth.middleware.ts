import { NextFunction, Request, Response } from 'express';

import { verifyAccessToken } from '@/utils/jwt.util';

export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.slice(7);

  try {
    req.user = verifyAccessToken(token);
  } catch (error) {
    // Ignore invalid tokens for optional auth routes
  } finally {
    next();
  }
};
