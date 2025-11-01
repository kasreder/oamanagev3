import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import logger from '../utils/logger';

dotenv.config();

const connectionLimit = Number(process.env.DB_CONNECTION_LIMIT) || 10;
const port = Number(process.env.DB_PORT) || 3306;

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit,
  queueLimit: 0,
});

export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await db.getConnection();
    logger.info('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    return false;
  }
};

const runQuery = async (query: string): Promise<void> => {
  await db.query(query);
};

export const createTablesIfNotExists = async (): Promise<void> => {
  try {
    logger.info('🔄 Checking and creating tables...');

    await runQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        employee_id VARCHAR(32) UNIQUE NOT NULL COMMENT '사번',
        name VARCHAR(64) NOT NULL COMMENT '사용자 이름',
        email VARCHAR(128) UNIQUE COMMENT '이메일',
        phone VARCHAR(32) COMMENT '전화번호',
        role VARCHAR(20) DEFAULT 'user' COMMENT 'user, admin',
        provider VARCHAR(20) COMMENT 'kakao, naver, google, teams',
        provider_id VARCHAR(128) COMMENT '플랫폼별 고유 ID',
        department_hq VARCHAR(64) COMMENT '본부',
        department_dept VARCHAR(64) COMMENT '부서',
        department_team VARCHAR(64) COMMENT '팀',
        department_part VARCHAR(64) COMMENT '파트',
        is_active BOOLEAN DEFAULT TRUE,
        last_login_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_provider (provider, provider_id),
        INDEX idx_department (department_team),
        INDEX idx_active (is_active),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await runQuery(`
      CREATE TABLE IF NOT EXISTS assets (
        uid VARCHAR(64) PRIMARY KEY COMMENT '자산 관리 코드',
        name VARCHAR(128) COMMENT '자산 이름',
        asset_type VARCHAR(64) COMMENT '장비 분류',
        model_name VARCHAR(128) COMMENT '모델명',
        serial_number VARCHAR(128) COMMENT '시리얼 넘버',
        vendor VARCHAR(128) COMMENT '제조사',
        status VARCHAR(32) DEFAULT '사용' COMMENT '자산 상태',
        location_text VARCHAR(256),
        building VARCHAR(64),
        floor VARCHAR(32),
        location_row INT,
        location_col INT,
        owner_user_id BIGINT,
        metadata JSON COMMENT '추가 필드',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_status (status),
        INDEX idx_type (asset_type),
        INDEX idx_owner (owner_user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await runQuery(`
      CREATE TABLE IF NOT EXISTS inspections (
        id VARCHAR(64) PRIMARY KEY COMMENT '실사 식별자',
        asset_uid VARCHAR(64) NOT NULL,
        status VARCHAR(32) NOT NULL,
        memo TEXT,
        scanned_at TIMESTAMP NOT NULL,
        synced BOOLEAN DEFAULT FALSE,
        user_team VARCHAR(128),
        user_id BIGINT,
        asset_type VARCHAR(64),
        verified BOOLEAN DEFAULT FALSE,
        barcode_photo_url VARCHAR(256),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (asset_uid) REFERENCES assets(uid) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_asset_scanned (asset_uid, scanned_at DESC),
        INDEX idx_synced (synced),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await runQuery(`
      CREATE TABLE IF NOT EXISTS signatures (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        asset_uid VARCHAR(64) NOT NULL,
        user_id BIGINT NOT NULL,
        user_name VARCHAR(64),
        storage_location VARCHAR(256) NOT NULL,
        file_size INT,
        mime_type VARCHAR(50) DEFAULT 'image/png',
        sha256 CHAR(64) UNIQUE,
        captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (asset_uid) REFERENCES assets(uid) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_asset_user (asset_uid, user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await runQuery(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        user_id BIGINT NOT NULL,
        token VARCHAR(512) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user (user_id),
        INDEX idx_expires (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await runQuery(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        user_id BIGINT,
        action VARCHAR(50) NOT NULL,
        resource_type VARCHAR(50) NOT NULL,
        resource_id VARCHAR(128),
        changes JSON,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_user_action (user_id, action),
        INDEX idx_resource (resource_type, resource_id),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    logger.info('✅ All tables created or already exist');
  } catch (error) {
    logger.error('❌ Failed to create tables:', error);
    throw error;
  }
};

export const initializeDatabase = async (): Promise<void> => {
  const connected = await testConnection();
  if (!connected) {
    throw new Error('Database connection failed');
  }

  if (String(process.env.AUTO_MIGRATE).toLowerCase() !== 'false') {
    await createTablesIfNotExists();
  } else {
    logger.info('AUTO_MIGRATE is disabled. Skipping table creation.');
  }
};
