import express, { Application } from 'express';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

import { createRateLimiter } from '@/middlewares/rate-limiter.middleware';
import { errorHandler } from '@/middlewares/error.middleware';
import routes from '@/routes';
import { testConnection } from '@/config/database';
import logger from '@/utils/logger';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const apiPrefix = process.env.API_PREFIX || '/api/v1';

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || '*' }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(createRateLimiter());

app.use(apiPrefix, routes);

app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      logger.info(`🚀 Server running at http://localhost:${PORT}${apiPrefix}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  void startServer();
}

export default app;
