import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { unauthorized } from '@/utils/errors';

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw unauthorized();
  }

  try {
    const token = header.slice(7);
    const secret = process.env.JWT_SECRET || 'development-secret';
    const payload = jwt.verify(token, secret);
    if (typeof payload === 'string' || !payload.sub) {
      throw unauthorized();
    }
    req.user = {
      id: Number(payload.sub),
      name: (payload as jwt.JwtPayload).name as string,
      provider: (payload as jwt.JwtPayload).provider as string
    };
    next();
  } catch {
    throw unauthorized();
  }
};
