-- Users table definition
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  employee_id VARCHAR(32) UNIQUE NOT NULL COMMENT '사번',
  name VARCHAR(64) NOT NULL COMMENT '사용자 이름',
  email VARCHAR(128) UNIQUE COMMENT '이메일',
  phone VARCHAR(32) COMMENT '전화번호',
  role VARCHAR(20) DEFAULT 'user' COMMENT 'user, admin',
  provider VARCHAR(20) COMMENT '로그인 플랫폼: kakao, naver, google, teams',
  provider_id VARCHAR(128) COMMENT '플랫폼별 고유 ID',
  department_hq VARCHAR(64) COMMENT '본부',
  department_dept VARCHAR(64) COMMENT '부서',
  department_team VARCHAR(64) COMMENT '팀',
  department_part VARCHAR(64) COMMENT '파트/실',
  is_active BOOLEAN DEFAULT TRUE COMMENT '활성 여부',
  last_login_at TIMESTAMP NULL DEFAULT NULL COMMENT '최근 로그인 시각',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_provider (provider, provider_id),
  INDEX idx_department (department_team),
  INDEX idx_active (is_active),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='사용자 정보 테이블';
