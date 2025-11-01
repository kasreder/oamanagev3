import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';

import { requestLogger } from './middlewares/logger.middleware';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import apiRouter from './routes';
import healthRouter from './routes/health.routes';

const app: Application = express();

const apiPrefix = process.env.API_PREFIX ?? '/api/v1';
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean) ?? ['*'];

app.set('trust proxy', true);
app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins.length === 1 && allowedOrigins[0] === '*' ? '*' : allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }),
);
app.use(compression());
app.use(express.json({ limit: process.env.REQUEST_BODY_LIMIT ?? '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use('/health', healthRouter);
app.use(apiPrefix, apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
