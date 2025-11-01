import dotenv from 'dotenv';
import mysql, { Pool, PoolOptions } from 'mysql2/promise';

dotenv.config();

const DEFAULT_CONNECTION_LIMIT = 10;

const poolConfig: PoolOptions = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'oa_asset_manager',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || DEFAULT_CONNECTION_LIMIT),
  queueLimit: 0,
  namedPlaceholders: true,
  timezone: 'Z',
  dateStrings: true,
  multipleStatements: true,
};

let pool: Pool | undefined;

export const getPool = (): Pool => {
  if (!pool) {
    pool = mysql.createPool(poolConfig);
  }

  return pool;
};

export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
};

export const testConnection = async (): Promise<void> => {
  const connection = await getPool().getConnection();

  try {
    await connection.ping();
  } finally {
    connection.release();
  }
};

export const ensureDatabase = async (): Promise<void> => {
  const { database, ...rest } = poolConfig;

  if (!database) {
    throw new Error('Database name is not defined. Please set DB_NAME in the environment.');
  }

  const connection = await mysql.createConnection(rest);

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
  } finally {
    await connection.end();
  }
};

export const getPoolConfig = (): PoolOptions => ({ ...poolConfig });
