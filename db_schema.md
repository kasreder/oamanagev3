# 데이터베이스 구조 설계

> MySQL 8.x를 기반으로 한 관계형 데이터베이스 스키마를 정의한다.

## 개체 관계 개요
```
Users (1) ────< AssetAssignments >──── (1) Assets
     \                                 /
      \                               /
       └────────────< Inspections >──┘
                        |
                        └────< Signatures
```

- **Users**: 자산을 사용하는 직원 정보. 조직 계층, 사번, 소셜 로그인 정보를 포함.
- **Assets**: OA 자산 기본 정보 및 자유 형식 메타데이터.
- **AssetAssignments**: 사용자와 자산의 소유 관계(옵션). 필요 시 정규화를 위해 분리.
- **Inspections**: 실사 기록. 스캔 시각, 상태, 메모, 담당자 등을 보관.
- **Signatures**: 인증 서명 이미지 및 메타데이터. 파일 경로를 참조.

## 테이블 상세

### users
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  employee_id VARCHAR(32) UNIQUE NOT NULL COMMENT '사번',
  name VARCHAR(64) NOT NULL COMMENT '사용자 이름',
  email VARCHAR(128) UNIQUE COMMENT '이메일',
  phone VARCHAR(32) COMMENT '전화번호',
  
  -- 소셜 로그인 정보
  provider VARCHAR(20) COMMENT '로그인 플랫폼: kakao, naver, google, teams',
  provider_id VARCHAR(128) COMMENT '플랫폼별 고유 ID',
  
  -- 조직 정보
  department_hq VARCHAR(64) COMMENT '본부',
  department_dept VARCHAR(64) COMMENT '부서',
  department_team VARCHAR(64) COMMENT '팀',
  department_part VARCHAR(64) COMMENT '파트/실',
  
  -- 메타
  is_active BOOLEAN DEFAULT TRUE COMMENT '활성 여부',
  last_login_at TIMESTAMP COMMENT '최근 로그인 시각',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_provider (provider, provider_id),
  INDEX idx_department (department_team),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='사용자 정보 테이블';
```

### assets
```sql
CREATE TABLE assets (
  uid VARCHAR(64) PRIMARY KEY COMMENT '자산 관리 코드',
  name VARCHAR(128) COMMENT '자산 이름 또는 사용자명',
  asset_type VARCHAR(64) COMMENT '장비 분류',
  model_name VARCHAR(128) COMMENT '모델명',
  serial_number VARCHAR(128) COMMENT '시리얼 넘버',
  vendor VARCHAR(128) COMMENT '제조사',
  status VARCHAR(32) DEFAULT '사용' COMMENT '자산 상태',
  
  -- 위치 정보
  location_text VARCHAR(256) COMMENT '가공된 위치 문자열',
  building VARCHAR(64) COMMENT '건물명',
  floor VARCHAR(32) COMMENT '층 정보',
  location_row INT COMMENT '평면도 행',
  location_col INT COMMENT '평면도 열',
  
  -- 소유자
  owner_user_id BIGINT COMMENT '현재 소유자',
  
  -- 메타데이터 (JSON 형식)
  metadata JSON COMMENT '추가 필드 (os, network, memo 등)',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_type (asset_type),
  INDEX idx_owner (owner_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='자산 정보 테이블';
```

### asset_assignments (선택)
```sql
CREATE TABLE asset_assignments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  asset_uid VARCHAR(64) NOT NULL,
  user_id BIGINT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '배정 일시',
  revoked_at TIMESTAMP COMMENT '회수 일시',
  memo TEXT COMMENT '특이사항',
  
  FOREIGN KEY (asset_uid) REFERENCES assets(uid) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_asset (asset_uid),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='자산 배정 이력';
```

### inspections
```sql
CREATE TABLE inspections (
  id VARCHAR(64) PRIMARY KEY COMMENT '실사 식별자',
  asset_uid VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL COMMENT '실사 결과 상태',
  memo TEXT COMMENT '메모/특이사항',
  scanned_at TIMESTAMP NOT NULL COMMENT '스캔 시각',
  synced BOOLEAN DEFAULT FALSE COMMENT '서버 반영 여부',
  
  -- 실사자 정보
  user_team VARCHAR(128) COMMENT '실사자 소속',
  user_id BIGINT COMMENT '실사자 ID',
  
  -- 자산 정보 (스냅샷)
  asset_type VARCHAR(64) COMMENT '실사 시 확인된 장비 유형',
  
  -- 인증 정보
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
```

### signatures
```sql
CREATE TABLE signatures (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  asset_uid VARCHAR(64) NOT NULL,
  user_id BIGINT NOT NULL,
  user_name VARCHAR(64) COMMENT '서명자 이름(보조)',
  
  -- 파일 정보
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
```

### audit_logs
```sql
CREATE TABLE audit_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  action VARCHAR(50) NOT NULL COMMENT 'CREATE, UPDATE, DELETE 등',
  resource_type VARCHAR(50) NOT NULL COMMENT 'asset, inspection, signature 등',
  resource_id VARCHAR(128) COMMENT '대상 리소스 ID',
  changes JSON COMMENT '변경 내용 (before/after)',
  
  -- 요청 정보
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_action (user_id, action),
  INDEX idx_resource (resource_type, resource_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='감사 로그';
```

### refresh_tokens
```sql
CREATE TABLE refresh_tokens (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  token VARCHAR(512) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Refresh 토큰 저장';
```

## 인덱스 및 최적화

### 성능 최적화 인덱스
- `inspections(asset_uid, scanned_at DESC)`: 자산별 최신 실사 빠른 조회
- `assets(status)`: 상태별 필터링
- `signatures(asset_uid, user_id)`: 인증 존재 여부 판단
- `audit_logs(created_at)`: 로그 시계열 조회

### JSON 필드 활용
MySQL 8.x의 JSON 타입을 활용하여 `assets.metadata`에 유연한 키-값 저장:
```sql
-- 메타데이터 검색 예시
SELECT * FROM assets 
WHERE JSON_EXTRACT(metadata, '$.os') = 'Windows 11';

-- JSON 인덱스 생성 (필요시)
ALTER TABLE assets 
ADD INDEX idx_metadata_os ((JSON_EXTRACT(metadata, '$.os')));
```

## 초기 설정 스크립트

```sql
-- 데이터베이스 생성
CREATE DATABASE oa_asset_manager 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE oa_asset_manager;

-- 위 테이블들 생성
-- (users, assets, asset_assignments, inspections, signatures, audit_logs, refresh_tokens)

-- 기본 제약 조건 확인
SET FOREIGN_KEY_CHECKS=1;
```

## 데이터 마이그레이션

### 서버 초기 데이터 적재
1. CSV 또는 JSON 형식의 초기 데이터 준비
2. Node.js 스크립트로 MySQL에 삽입:
```javascript
// 예시: TypeORM 사용
const users = await UserRepository.save([
  { employeeId: 'EMP001', name: '홍길동', email: 'hong@example.com' }
]);
```

### 앱 동기화 로직
- 앱 시작 시: `GET /assets`, `GET /inspections`로 전체 데이터 수신
- 로컬 DB(sqflite)에 저장
- 변경 발생 시: API로 전송 후 `synced=true` 업데이트

## 데이터 검증 규칙

- 자산 UID는 대소문자 구분 없음 (저장 시 정규화)
- 서명 이미지는 PNG로 강제 변환, 최대 5MB
- 실사 메모는 2KB 이내로 제한
- JSON 메타데이터는 허용된 키 목록 검증:
  - 허용 키: `os`, `os_ver`, `network`, `memo`, `memo2`

## 백업 및 복구

### 일일 백업
```bash
# mysqldump를 이용한 백업
mysqldump -u root -p oa_asset_manager > backup_$(date +%Y%m%d).sql

# 압축
gzip backup_$(date +%Y%m%d).sql
```

### 복구
```bash
mysql -u root -p oa_asset_manager < backup_20240101.sql
```

## 보안 고려사항

- **비밀번호**: 소셜 로그인 위주이므로 비밀번호 저장하지 않음
- **민감 정보**: 개인정보(이메일, 전화번호)는 암호화 권장
- **접근 제어**: MySQL 사용자 권한을 역할별로 분리:
  - `app_user`: SELECT, INSERT, UPDATE (DELETE 제한)
  - `admin_user`: 전체 권한
- **SQL Injection 방지**: Prepared Statement 사용 필수

## 성능 모니터링

### Slow Query Log 활성화
```sql
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

### 주요 모니터링 쿼리
```sql
-- 가장 느린 쿼리 확인
SELECT * FROM mysql.slow_log 
ORDER BY query_time DESC 
LIMIT 10;

-- 테이블 크기 확인
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.TABLES
WHERE table_schema = 'oa_asset_manager'
ORDER BY size_mb DESC;
```

## 확장 고려사항

- **파티셔닝**: `inspections`, `audit_logs`는 날짜 기준 파티션 고려
- **읽기 복제**: 읽기 부하 분산을 위한 Replica 서버 구성
- **캐싱**: Redis를 이용한 자주 조회되는 데이터 캐싱
- **Full-text Search**: 자산 검색 성능 향상을 위한 Elasticsearch 연동
