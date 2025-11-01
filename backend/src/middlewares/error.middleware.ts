import { NextFunction, Request, Response } from 'express';

import logger from '../utils/logger';

export class HttpError extends Error {
  public status: number;
  public code: string;
  public details?: unknown;

  constructor(status: number, message: string, code = 'ERROR', details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  next(new HttpError(404, '요청하신 리소스를 찾을 수 없습니다.', 'NOT_FOUND'));
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const status = err instanceof HttpError ? err.status : 500;
  const code = err instanceof HttpError ? err.code : 'INTERNAL_SERVER_ERROR';
  const message = err.message || '서버 오류가 발생했습니다.';

  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    code,
    status,
    correlationId: req.correlationId,
    path: req.originalUrl,
  });

  res.status(status).json({
    error: code,
    message,
    ...(err instanceof HttpError && err.details ? { details: err.details } : {}),
    correlationId: req.correlationId,
  });
};
