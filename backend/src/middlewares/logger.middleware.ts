import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

import logger from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const correlationId = req.headers['x-request-id']?.toString() ?? randomUUID();
  req.correlationId = correlationId;
  res.setHeader('X-Request-Id', correlationId);

  const startAt = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startAt) / 1_000_000;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`, {
      correlationId,
      durationMs: durationMs.toFixed(2),
      userId: req.user?.id,
    });
  });

  next();
};
