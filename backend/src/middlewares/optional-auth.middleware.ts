import { NextFunction, Request, Response } from 'express';

import { verifyAccessToken } from '../utils/jwt.util';

const extractToken = (req: Request): string | undefined => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return undefined;
  }

  const [scheme, token] = authorization.split(' ');
  if (scheme?.toLowerCase() !== 'bearer') {
    return undefined;
  }

  return token;
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const token = extractToken(req);

  if (!token) {
    return next();
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
  } catch (error) {
    req.user = undefined;
  }

  next();
};
