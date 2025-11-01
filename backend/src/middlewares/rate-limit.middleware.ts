import { NextFunction, Request, Response } from 'express';

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message: Record<string, unknown>;
}

interface ClientRecord {
  count: number;
  expiresAt: number;
}

const cleanupStore = (store: Map<string, ClientRecord>): void => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (record.expiresAt <= now) {
      store.delete(key);
    }
  }
};

const createRateLimiter = ({ windowMs, max, message }: RateLimitOptions) => {
  const store = new Map<string, ClientRecord>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now();
    const pathKey = `${req.baseUrl}${req.path}`;
    const key = `${req.ip ?? 'unknown'}::${pathKey}`;

    cleanupStore(store);

    const record = store.get(key);

    if (!record || record.expiresAt <= now) {
      store.set(key, { count: 1, expiresAt: now + windowMs });
      next();
      return;
    }

    if (record.count >= max) {
      res.status(429).json(message);
      return;
    }

    record.count += 1;
    next();
  };
};

export const publicApiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'TOO_MANY_REQUESTS',
    message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  },
});

export const authApiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'TOO_MANY_ATTEMPTS', message: '로그인 시도가 너무 많습니다.' },
});
