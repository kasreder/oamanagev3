-- Assets table definition
CREATE TABLE IF NOT EXISTS assets (
  uid VARCHAR(64) PRIMARY KEY COMMENT '자산 관리 코드',
  name VARCHAR(128) COMMENT '자산 이름 또는 사용자명',
  asset_type VARCHAR(64) COMMENT '장비 분류',
  model_name VARCHAR(128) COMMENT '모델명',
  serial_number VARCHAR(128) COMMENT '시리얼 넘버',
  vendor VARCHAR(128) COMMENT '제조사',
  status VARCHAR(32) DEFAULT '사용' COMMENT '자산 상태',
  location_text VARCHAR(256) COMMENT '가공된 위치 문자열',
  building VARCHAR(64) COMMENT '건물명',
  floor VARCHAR(32) COMMENT '층 정보',
  location_row INT COMMENT '평면도 행',
  location_col INT COMMENT '평면도 열',
  owner_user_id BIGINT COMMENT '현재 소유자',
  metadata JSON COMMENT '추가 필드 (os, network, memo 등)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_type (asset_type),
  INDEX idx_owner (owner_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='자산 정보 테이블';
