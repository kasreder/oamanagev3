import { NextFunction, Request, Response } from 'express';

import { verifyAccessToken } from '../utils/jwt.util';
import { HttpError } from './error.middleware';

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

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const token = extractToken(req);

  if (!token) {
    throw new HttpError(401, '인증이 필요합니다.', 'UNAUTHORIZED');
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    throw new HttpError(
      401,
      '유효하지 않은 토큰입니다.',
      'INVALID_TOKEN',
      (error as Error).message,
    );
  }
};
