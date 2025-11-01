import { NextFunction, Request, Response } from 'express';

import { logger } from '@/utils/logger';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;

    logger.info('%s %s %d %.2fms', req.method, req.originalUrl, res.statusCode, durationMs);
  });

  next();
};
