import { createPool, Pool } from 'mysql2/promise';

import logger from '@/utils/logger';

let pool: Pool | null = null;

export const getPool = (): Pool => {
  if (!pool) {
    pool = createPool({
      uri: process.env.DATABASE_URL,
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'oa_asset_manager',
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    });
  }

  return pool;
};

export const testConnection = async (): Promise<void> => {
  try {
    const connection = await getPool().getConnection();
    await connection.ping();
    connection.release();
    logger.info('✅ Database connection successful');
  } catch (error) {
    logger.warn('⚠️ Database connection failed, continuing in mock mode');
    logger.debug?.(error as Error);
  }
};
