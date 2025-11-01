-- Inspections table definition
CREATE TABLE IF NOT EXISTS inspections (
  id VARCHAR(64) PRIMARY KEY COMMENT '실사 식별자',
  asset_uid VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL COMMENT '실사 결과 상태',
  memo TEXT COMMENT '메모/특이사항',
  scanned_at TIMESTAMP NOT NULL COMMENT '스캔 시각',
  synced BOOLEAN DEFAULT FALSE COMMENT '서버 반영 여부',
  user_team VARCHAR(128) COMMENT '실사자 소속',
  user_id BIGINT COMMENT '실사자 ID',
  asset_type VARCHAR(64) COMMENT '실사 시 확인된 장비 유형',
  verified BOOLEAN DEFAULT FALSE COMMENT '인증 여부',
  barcode_photo_url VARCHAR(256) COMMENT '바코드 사진 경로',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (asset_uid) REFERENCES assets(uid) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_asset_scanned (asset_uid, scanned_at DESC),
  INDEX idx_synced (synced),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='실사 기록 테이블';
