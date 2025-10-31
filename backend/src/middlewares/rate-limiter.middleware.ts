import rateLimit from 'express-rate-limit';

export const createRateLimiter = () =>
  rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.originalUrl.includes('/health')
  });
