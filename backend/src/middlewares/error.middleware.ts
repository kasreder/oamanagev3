import type { NextFunction, Request, Response } from 'express';

import { ApiError } from '@/utils/errors';
import logger from '@/utils/logger';

export const errorHandler = (error: unknown, req: Request, res: Response, _next: NextFunction): void => {
  if (error instanceof ApiError) {
    logger.warn(`${req.method} ${req.originalUrl} -> ${error.statusCode} ${error.message}`);
    res.status(error.statusCode).json({
      error: error.code,
      message: error.message,
      details: error.details
    });
    return;
  }

  logger.error('Unexpected error', error as Error);
  res.status(500).json({ error: 'INTERNAL_ERROR', traceId: req.headers['x-request-id'] });
};
