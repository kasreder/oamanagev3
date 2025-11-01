import { NextFunction, Request, Response } from 'express';

import { logger } from '@/utils/logger';

export class HttpError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    message: 'Resource not found',
    path: req.originalUrl,
  });
};

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const status = error instanceof HttpError ? error.status : 500;
  const message = error.message || 'Internal server error';

  logger.error('Request failed', {
    status,
    message,
    path: req.originalUrl,
    method: req.method,
    stack: error.stack,
  });

  res.status(status).json({
    message,
    ...(error instanceof HttpError && error.details ? { details: error.details } : {}),
  });
};
