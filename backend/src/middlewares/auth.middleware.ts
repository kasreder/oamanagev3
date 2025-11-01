import { NextFunction, Request, Response } from 'express';

import { verifyAccessToken } from '@/utils/jwt.util';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
