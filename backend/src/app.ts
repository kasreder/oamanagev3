import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';

import { errorHandler, notFoundHandler } from '@/middlewares/error.middleware';
import { requestLogger } from '@/middlewares/logger.middleware';
import { rateLimiter } from '@/middlewares/rate-limit.middleware';
import { registerRoutes } from '@/routes';

dotenv.config();

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

const corsOrigins = process.env.CORS_ORIGIN?.split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: corsOrigins && corsOrigins.length > 0 ? corsOrigins : undefined,
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);
app.use(requestLogger);

registerRoutes(app);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
