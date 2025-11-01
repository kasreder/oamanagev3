-- Audit logs table definition
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NULL,
  action VARCHAR(50) NOT NULL COMMENT 'CREATE, UPDATE, DELETE 등',
  resource_type VARCHAR(50) NOT NULL COMMENT 'asset, inspection, signature 등',
  resource_id VARCHAR(128) COMMENT '대상 리소스 ID',
  changes JSON COMMENT '변경 내용 (before/after)',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_action (user_id, action),
  INDEX idx_resource (resource_type, resource_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='감사 로그';
