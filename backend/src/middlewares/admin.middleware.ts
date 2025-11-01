import { NextFunction, Request, Response } from 'express';

import { HttpError } from './error.middleware';

export const requireAdmin = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    throw new HttpError(401, '인증이 필요합니다.', 'UNAUTHORIZED');
  }

  if (req.user.role !== 'admin') {
    throw new HttpError(403, '관리자 권한이 필요합니다.', 'FORBIDDEN');
  }

  next();
};
