-- Signatures table definition
CREATE TABLE IF NOT EXISTS signatures (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  asset_uid VARCHAR(64) NOT NULL,
  user_id BIGINT NOT NULL,
  user_name VARCHAR(64) COMMENT '서명자 이름(보조)',
  storage_location VARCHAR(256) NOT NULL COMMENT '파일 경로 또는 URL',
  file_size INT COMMENT '파일 크기 (bytes)',
  mime_type VARCHAR(50) DEFAULT 'image/png',
  sha256 CHAR(64) UNIQUE COMMENT '이미지 무결성 체크용 해시',
  captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '서명 저장 시각',
  FOREIGN KEY (asset_uid) REFERENCES assets(uid) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_asset_user (asset_uid, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='서명 이미지 메타데이터';
