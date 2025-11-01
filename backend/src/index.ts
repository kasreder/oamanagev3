import dotenv from 'dotenv';
import http from 'http';

import { app } from './app';
import { closePool, ensureDatabase, testConnection } from './config/database';
import { logger } from './utils/logger';

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const ENV = process.env.NODE_ENV || 'development';

const startServer = async (): Promise<void> => {
  try {
    await ensureDatabase();
    await testConnection();

    const server = http.createServer(app);

    server.listen(PORT, () => {
      logger.info('🚀 Server is running on http://localhost:%d', PORT);
      logger.info('✅ Database connected successfully');
      logger.info('📊 Environment: %s', ENV);
    });

    const gracefulShutdown = (signal: NodeJS.Signals) => {
      logger.info('Received %s. Shutting down gracefully...', signal);

      server.close(async error => {
        if (error) {
          logger.error('Error during server shutdown', { error });
          process.exit(1);
        }

        await closePool();
        logger.info('Server closed. Goodbye!');
        process.exit(0);
      });
    };

    ['SIGINT', 'SIGTERM'].forEach(signal => {
      process.on(signal, gracefulShutdown);
    });

    process.on('unhandledRejection', reason => {
      logger.error('Unhandled promise rejection', { reason });
    });

    process.on('uncaughtException', error => {
      logger.error('Uncaught exception', { error });
      gracefulShutdown('SIGTERM');
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
};

void startServer();
