# OA Asset Manager 프로젝트 개요

## 비전과 목표
- **비전**: 현장 실사·인증 업무를 모바일/웹 어디에서든 일관되게 처리할 수 있는 하이브리드 OA 자산 관리 플랫폼을 제공한다.
- **핵심 목표**
  - 실사, 자산 관리, 인증 과정을 하나의 애플리케이션에 통합해 사용자의 작업 전환 비용을 줄인다.
  - 네트워크 연결이 불안정한 환경에서도 동작하도록 로컬 캐시 기반 오프라인 친화적인 구조를 갖춘다.
  - 서명, 바코드 사진 등 증빙 자료를 간편히 수집하고 서버와 동기화한다.
  - 소셜 로그인(카카오, 네이버, 구글, 팀즈)을 통한 간편한 사용자 인증을 제공한다.

## 제품 요약
- **앱 이름**: OA Asset Manager
- **프론트 플랫폼**: Flutter 3.29 (모바일, 데스크톱, 웹 동시 지원)
- **백엔드 플랫폼**: Node.js 22.x + TypeScript 5.3.x
- **데이터베이스**: MySQL 8.x
- **주요 사용자**: OA 자산 실사자, IT 자산 관리자, 인증 담당자
- **핵심 기능 영역**
  1. 소셜 로그인 인증 (카카오, 네이버, 구글, 팀즈)
  2. 자산 실사 현황 조회 및 편집
  3. 자산 스캔/등록 및 메타데이터 관리
  4. 인증(서명·바코드 사진) 수집 및 배치 검증
  5. 사용자/조직 참조 데이터 활용을 통한 검색 및 자동 입력

## TypeScript 설정 (Node.js 22.x 호환)

### 권장 버전
- **Node.js**: 22.x LTS
- **TypeScript**: 5.3.x (Node.js 22와 완벽 호환)
- **ts-node**: 10.9.x (개발 시 TS 직접 실행)

### 주요 TypeScript 기능 활용
- **엄격한 타입 체크**: `strict: true` 모드로 런타임 에러 사전 방지
- **최신 ECMAScript**: ES2022 타겟으로 최신 문법 사용
- **경로 별칭**: `@/` 접두사로 절대 경로 임포트 (예: `import { User } from '@/models/User'`)
- **데코레이터**: TypeORM 엔터티 정의에 활용

## 아키텍처 개요
| 계층 | 구성 요소 | 설명 |
| --- | --- | --- |
| 프레젠테이션 | `lib/view/**` | AppScaffold로 감싼 페이지들이 GoRouter 경로에 매핑되어 있으며, Consumer/Provider 패턴으로 상태를 구독한다. |
| 상태 관리 | `lib/providers/**` | InspectionProvider가 자산·사용자 레퍼런스, 실사 목록, 필터 상태를 보유하고 ChangeNotifier로 라우터 및 UI를 갱신한다. AuthProvider가 소셜 로그인 상태를 관리한다. |
| 데이터 | `lib/data/**` | InspectionRepository가 REST API를 통해 데이터를 조회/수정하고, SignatureStorage가 플랫폼별(웹/모바일)로 서명 파일을 저장한다. |
| 모델 | `lib/models/**` | Inspection, Asset, User 등 엔터티를 정의하고 JSON 변환, copyWith 로직을 제공한다. |
| 라우팅 | `lib/router/app_router.dart` | GoRouter 기반의 경로 정의 및 오류 처리, 인증 상태에 따른 리다이렉트 처리. |

## 프론트엔드 폴더 구조 (Flutter)

```
lib/
├── main.dart                          # 앱 진입점, Provider 초기화, MaterialApp 설정
├── config/
│   ├── theme.dart                     # Material 3 테마 정의, 색상 스키마
│   └── constants.dart                 # API URL, 앱 설정 상수
│
├── models/                            # 데이터 모델 (엔터티)
│   ├── inspection.dart                # 실사 기록 모델
│   ├── asset.dart                     # 자산 정보 모델
│   ├── user.dart                      # 사용자 모델
│   └── verification.dart              # 인증 정보 모델
│
├── providers/                         # 상태 관리 (Provider 패턴)
│   ├── inspection_provider.dart       # 실사 데이터 상태 관리
│   ├── auth_provider.dart             # 인증 상태 관리, 로그인/로그아웃
│   └── sync_provider.dart             # 오프라인 동기화 상태 관리
│
├── services/                          # 비즈니스 로직 및 외부 서비스
│   ├── auth_service.dart              # 소셜 로그인 통합 서비스
│   ├── api_client.dart                # HTTP 클라이언트, 인터셉터
│   ├── local_storage_service.dart     # 로컬 DB (sqflite) 관리
│   ├── signature_service.dart         # 서명 처리 로직
│   └── sync_service.dart              # 오프라인 큐 동기화
│
├── data/                              # 데이터 계층 (Repository 패턴)
│   ├── repositories/
│   │   ├── inspection_repository.dart # 실사 데이터 CRUD
│   │   ├── asset_repository.dart      # 자산 데이터 CRUD
│   │   └── user_repository.dart       # 사용자 데이터 조회
│   └── storage/
│       ├── signature_storage.dart     # 서명 파일 저장소 (추상화)
│       ├── signature_storage_web.dart # 웹 구현 (localStorage)
│       └── signature_storage_mobile.dart # 모바일 구현 (파일 시스템)
│
├── view/                              # UI 화면 (페이지 및 위젯)
│   ├── login/
│   │   └── login_page.dart            # 소셜 로그인 화면
│   ├── home/
│   │   └── home_page.dart             # 홈 대시보드
│   ├── scan/
│   │   └── scan_page.dart             # QR 스캔 화면
│   ├── assets/
│   │   ├── list_page.dart             # 자산 목록
│   │   ├── detail_page.dart           # 자산 상세
│   │   └── registration_page.dart     # 자산 등록
│   ├── verification/
│   │   ├── list_page.dart             # 인증 목록
│   │   ├── detail_page.dart           # 단일 자산 인증 상세
│   │   └── group_page.dart            # 그룹 자산 인증
│   ├── profile/
│   │   └── profile_page.dart          # 사용자 프로필
│   └── common/                        # 공통 위젯
│       ├── app_scaffold.dart          # 앱 레이아웃 (네비게이션)
│       ├── scanned_footer.dart        # QR 스캔 바로가기 버튼
│       └── loading_indicator.dart     # 로딩 표시
│
├── widgets/                           # 재사용 가능한 위젯
│   ├── signature_pad.dart             # 서명 캡처 위젯
│   ├── barcode_display.dart           # 바코드 이미지 표시
│   ├── asset_card.dart                # 자산 정보 카드
│   └── status_chip.dart               # 상태 표시 Chip
│
├── router/
│   └── app_router.dart                # GoRouter 라우팅 정의
│
└── utils/                             # 유틸리티 함수
    ├── date_formatter.dart            # 날짜 포맷팅
    ├── validator.dart                 # 입력 검증
    └── logger.dart                    # 로깅 유틸

assets/
├── images/                            # 이미지 리소스
│   ├── logo.png                       # 앱 로고
│   └── icons/                         # 커스텀 아이콘
├── sounds/                            # 사운드 파일
│   ├── beep.mp3                       # 스캔 성공 사운드
│   └── error.mp3                      # 오류 사운드
└── fonts/                             # 커스텀 폰트 (필요시)

test/
├── unit/                              # 유닛 테스트
│   ├── services/                      # 서비스 로직 테스트
│   └── repositories/                  # Repository 테스트
├── widget/                            # 위젯 테스트
│   └── login_page_test.dart
└── integration/                       # 통합 테스트
    └── auth_flow_test.dart            # 인증 플로우 E2E
```

### 주요 폴더 역할 설명

- **models/**: 순수 데이터 클래스. JSON 직렬화/역직렬화, `copyWith` 메서드 포함. 비즈니스 로직 없음.
- **providers/**: ChangeNotifier 기반 상태 관리. UI에서 `Consumer`/`Provider.of`로 구독.
- **services/**: 비즈니스 로직과 외부 의존성(API, 소셜 로그인 SDK) 캡슐화.
- **data/repositories/**: 데이터 소스(API, 로컬 DB) 추상화. 서비스 계층에서 호출.
- **view/**: 화면 단위 페이지. 각 기능별로 폴더 구성. Stateless/Stateful Widget.
- **widgets/**: 여러 화면에서 재사용되는 UI 컴포넌트.
- **router/**: 앱 전체 라우팅 로직. 인증 상태 기반 리다이렉트 포함.

## 백엔드 폴더 구조 (Node.js + Express)

```
backend/
├── src/
│   ├── index.ts                       # 서버 진입점, Express 앱 초기화
│   ├── app.ts                         # Express 앱 설정, 미들웨어
│   │
│   ├── config/                        # 설정 파일
│   │   ├── database.ts                # MySQL 연결 설정
│   │   ├── auth.ts                    # JWT 시크릿, 만료 시간
│   │   └── social.ts                  # 소셜 로그인 API 키
│   │
│   ├── controllers/                   # 컨트롤러 (요청 처리)
│   │   ├── auth.controller.ts         # 인증 관련 (로그인, 로그아웃, 토큰 갱신)
│   │   ├── asset.controller.ts        # 자산 CRUD
│   │   ├── inspection.controller.ts   # 실사 CRUD
│   │   ├── verification.controller.ts # 인증/서명 처리
│   │   └── user.controller.ts         # 사용자 정보 조회/수정
│   │
│   ├── services/                      # 비즈니스 로직
│   │   ├── auth.service.ts            # 토큰 생성/검증, 소셜 로그인 검증
│   │   ├── asset.service.ts           # 자산 비즈니스 로직
│   │   ├── inspection.service.ts      # 실사 비즈니스 로직
│   │   ├── sync.service.ts            # 동기화 처리 로직
│   │   └── signature.service.ts       # 서명 파일 업로드/다운로드
│   │
│   ├── repositories/                  # 데이터베이스 접근 계층
│   │   ├── user.repository.ts         # users 테이블 쿼리
│   │   ├── asset.repository.ts        # assets 테이블 쿼리
│   │   ├── inspection.repository.ts   # inspections 테이블 쿼리
│   │   └── signature.repository.ts    # signatures 테이블 쿼리
│   │
│   ├── models/                        # TypeORM 엔터티 또는 타입 정의
│   │   ├── User.ts                    # User 엔터티
│   │   ├── Asset.ts                   # Asset 엔터티
│   │   ├── Inspection.ts              # Inspection 엔터티
│   │   └── Signature.ts               # Signature 엔터티
│   │
│   ├── middlewares/                   # Express 미들웨어
│   │   ├── auth.middleware.ts         # JWT 검증 미들웨어
│   │   ├── error.middleware.ts        # 에러 핸들링
│   │   ├── logger.middleware.ts       # 요청/응답 로깅
│   │   └── upload.middleware.ts       # 파일 업로드 (multer)
│   │
│   ├── routes/                        # API 라우트 정의
│   │   ├── index.ts                   # 라우트 통합
│   │   ├── auth.routes.ts             # /auth/* 라우트
│   │   ├── asset.routes.ts            # /assets/* 라우트
│   │   ├── inspection.routes.ts       # /inspections/* 라우트
│   │   ├── verification.routes.ts     # /verifications/* 라우트
│   │   └── user.routes.ts             # /users/* 라우트
│   │
│   ├── validators/                    # 요청 데이터 검증
│   │   ├── auth.validator.ts          # 로그인 검증 스키마
│   │   ├── asset.validator.ts         # 자산 입력 검증
│   │   └── inspection.validator.ts    # 실사 입력 검증
│   │
│   ├── utils/                         # 유틸리티 함수
│   │   ├── jwt.util.ts                # JWT 생성/검증 헬퍼
│   │   ├── password.util.ts           # 비밀번호 해싱 (선택)
│   │   ├── date.util.ts               # 날짜 변환
│   │   └── logger.ts                  # Winston 로거 설정
│   │
│   └── types/                         # TypeScript 타입 정의
│       ├── express.d.ts               # Express Request 확장
│       └── api.types.ts               # API 요청/응답 타입
│
├── migrations/                        # 데이터베이스 마이그레이션
│   ├── 001_create_users.sql
│   ├── 002_create_assets.sql
│   ├── 003_create_inspections.sql
│   └── 004_create_signatures.sql
│
├── seeds/                             # 초기 데이터 (테스트/스테이징)
│   ├── users.seed.ts
│   ├── assets.seed.ts
│   └── inspections.seed.ts
│
├── test/                              # 테스트
│   ├── unit/                          # 유닛 테스트
│   │   ├── services/
│   │   └── repositories/
│   ├── integration/                   # 통합 테스트
│   │   └── auth.test.ts
│   └── e2e/                           # E2E 테스트
│       └── assets.test.ts
│
├── uploads/                           # 업로드된 파일 (개발용)
│   ├── signatures/                    # 서명 이미지
│   └── barcodes/                      # 바코드 사진
│
├── logs/                              # 로그 파일
│   ├── error.log
│   └── combined.log
│
├── .env                               # 환경 변수 (Git 제외)
├── .env.example                       # 환경 변수 예시
├── package.json                       # NPM 의존성
├── tsconfig.json                      # TypeScript 설정
├── jest.config.js                     # 테스트 설정
└── README.md                          # 백엔드 문서
```

### 주요 폴더 역할 설명

- **controllers/**: HTTP 요청/응답 처리. 서비스 호출 후 결과 반환. 비즈니스 로직 없음.
- **services/**: 핵심 비즈니스 로직. 여러 Repository 조합, 트랜잭션 관리.
- **repositories/**: 데이터베이스 쿼리 실행. SQL 또는 ORM 메서드. 순수 데이터 접근.
- **models/**: TypeORM 엔터티 또는 TypeScript 인터페이스. DB 테이블 매핑.
- **middlewares/**: Express 미들웨어. 인증, 로깅, 에러 처리 등.
- **routes/**: API 엔드포인트 정의. 컨트롤러 메서드와 매핑.
- **validators/**: 입력 데이터 검증 스키마 (예: Joi, Zod).
- **migrations/**: 데이터베이스 스키마 버전 관리.
- **seeds/**: 테스트/개발용 초기 데이터.

## 환경 설정 파일

### 프론트엔드 (.env 예시)
```
API_BASE_URL=https://api.example.com
KAKAO_APP_KEY=your_kakao_key
NAVER_CLIENT_ID=your_naver_client_id
GOOGLE_CLIENT_ID=your_google_client_id
TEAMS_CLIENT_ID=your_teams_client_id
```

### 백엔드 (.env 예시)
```
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=oa_asset_manager

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# Social Login
KAKAO_REST_API_KEY=your_kakao_key
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
TEAMS_CLIENT_ID=your_teams_client_id
TEAMS_CLIENT_SECRET=your_teams_secret

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

## 실행 플로우
1. `main.dart`에서 `InspectionRepository`, `InspectionProvider`, `AuthProvider`를 생성하고 초기화한다.
2. 소셜 로그인을 통해 사용자 인증을 수행하고 JWT 토큰을 획득한다.
3. 초기화가 완료되면 `AppRouter`를 통해 페이지 라우팅을 구성하고 Material 3 테마로 앱을 실행한다.
4. 각 페이지는 Provider를 통해 실사 목록, 자산 정보, 사용자 정보를 구독하며 사용자 상호작용(검색, 수정, 서명 저장 등)에 따라 상태를 갱신한다.
5. 서명 및 바코드 이미지는 `SignatureStorage`가 플랫폼별 API를 통해 저장/조회하며, 오프라인 환경에서도 재활용된다.

## 기술 스택
- **프레임워크**: Flutter, Dart
- **라우팅/상태관리**: go_router, provider
- **하드웨어 연동**: mobile_scanner(카메라), permission_handler(권한)
- **미디어 처리**: image(바코드/서명 PNG 인코딩), audioplayers(피드백 사운드)
- **데이터 형식**: REST API 기반 JSON 통신, 로컬 캐시(sqflite), 로컬 파일/브라우저 스토리지
- **인증**: JWT Bearer Token, 소셜 로그인 SDK (kakao_flutter_sdk, google_sign_in, flutter_naver_login)

## 소셜 로그인 구현
### 지원 플랫폼
- **카카오톡**: kakao_flutter_sdk를 사용하여 카카오 계정 로그인
- **네이버**: flutter_naver_login을 사용하여 네이버 아이디 로그인
- **구글**: google_sign_in을 사용하여 구글 계정 로그인
- **Microsoft Teams**: microsoft_auth 또는 OAuth2 flow를 통한 Teams 계정 로그인

### 인증 플로우
1. 사용자가 소셜 로그인 버튼 선택
2. 해당 플랫폼의 SDK를 통해 OAuth 인증 수행
3. 인증 성공 시 플랫폼에서 제공하는 액세스 토큰 획득
4. 백엔드 서버로 액세스 토큰 전송 (`POST /auth/social/{provider}`)
5. 서버에서 토큰 검증 후 자체 JWT 토큰 발급
6. Flutter 앱에서 JWT 토큰을 secure storage에 저장
7. 이후 모든 API 요청 시 JWT 토큰을 Authorization 헤더에 포함

### 로그아웃 처리
- 로컬 저장된 JWT 토큰 삭제
- 소셜 플랫폼 SDK의 로그아웃 API 호출
- 인증 상태 초기화 및 로그인 페이지로 리다이렉트

## 품질 및 확장 전략
- **테스트 대상**: 
  - 데이터 파서 및 API 클라이언트 로직
  - 서명 저장 추상화(SignatureStorage)
  - 검색/필터 로직(AssetsListPage, AssetVerificationListPage)
  - 인증 플로우 및 토큰 관리
- **확장 포인트**
  - InspectionRepository를 통한 REST API 통신
  - SignatureStorage에 업로드 큐를 추가해 서버 동기화
  - Provider를 Riverpod/BLoC 등으로 교체할 수 있도록 상태 의존성을 명확히 분리
  - 추가 소셜 로그인 플랫폼 지원 (Apple, Facebook 등)
- **배포 고려 사항**: 
  - 모바일에서는 카메라/파일 권한 선언 필요
  - 각 소셜 로그인 플랫폼의 앱 등록 및 API 키 설정 필요
  - iOS/Android 각각의 네이티브 설정 (Info.plist, AndroidManifest.xml)

## 데이터베이스 구조
- **RDBMS**: MySQL 8.x
- **주요 테이블**: users, assets, inspections, signatures, asset_assignments, audit_logs
- **연결**: Node.js 백엔드에서 mysql2 또는 TypeORM을 통해 연결
- **트랜잭션 관리**: 모든 쓰기 작업은 트랜잭션으로 처리하고 감사 로그 기록

## 백엔드 구동 방법

### 1. 초기 설정

#### 필수 요구사항
```bash
# Node.js 버전 확인
node --version  # v22.x.x 이상

# npm 버전 확인
npm --version   # 10.x.x 이상
```

#### 프로젝트 초기화
```bash
# 프로젝트 폴더 생성
mkdir oa-asset-backend
cd oa-asset-backend

# package.json 생성
npm init -y

# TypeScript 및 필수 의존성 설치
npm install express mysql2 jsonwebtoken bcrypt dotenv cors
npm install multer joi express-validator

# TypeScript 및 개발 도구 설치
npm install -D typescript @types/node @types/express @types/jsonwebtoken
npm install -D @types/bcrypt @types/cors @types/multer
npm install -D ts-node nodemon @types/joi

# 소셜 로그인 라이브러리
npm install axios # 각 플랫폼 API 호출용

# 테스트 도구
npm install -D jest @types/jest ts-jest supertest @types/supertest

# 코드 품질 도구
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier
```

#### TypeScript 설정 파일 생성 (tsconfig.json)
```bash
npx tsc --init
```

**tsconfig.json 내용**:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@controllers/*": ["src/controllers/*"],
      "@services/*": ["src/services/*"],
      "@models/*": ["src/models/*"],
      "@middlewares/*": ["src/middlewares/*"],
      "@config/*": ["src/config/*"],
      "@utils/*": ["src/utils/*"]
    },
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test"]
}
```

#### package.json 스크립트 설정
```json
{
  "name": "oa-asset-backend",
  "version": "1.0.0",
  "description": "OA Asset Manager Backend API",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon --exec ts-node -r tsconfig-paths/register src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "start:prod": "NODE_ENV=production node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "db:migrate": "node dist/migrations/run.js",
    "db:seed": "node dist/seeds/run.js"
  },
  "keywords": ["asset-management", "typescript", "express"],
  "author": "",
  "license": "MIT"
}
```

**추가 경로 설정 패키지**:
```bash
npm install -D tsconfig-paths
```

### 2. 환경 변수 설정

**.env 파일 생성**:
```bash
# 루트 디렉토리에 .env 파일 생성
touch .env
```

**.env 내용**:
```env
# Server
NODE_ENV=development
PORT=3000
API_PREFIX=/api/v1

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=oa_asset_manager

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Social Login - Kakao
KAKAO_REST_API_KEY=your_kakao_rest_api_key
KAKAO_REDIRECT_URI=http://localhost:3000/auth/kakao/callback

# Social Login - Naver
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
NAVER_REDIRECT_URI=http://localhost:3000/auth/naver/callback

# Social Login - Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Social Login - Microsoft Teams
TEAMS_CLIENT_ID=your_teams_client_id
TEAMS_CLIENT_SECRET=your_teams_client_secret
TEAMS_TENANT_ID=common
TEAMS_REDIRECT_URI=http://localhost:3000/auth/teams/callback

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080

# Logging
LOG_LEVEL=debug
```

**.env.example 파일 생성** (Git에 커밋):
```bash
cp .env .env.example
# .env.example에서 실제 값들을 제거하고 플레이스홀더로 교체
```

**.gitignore 설정**:
```
node_modules/
dist/
.env
*.log
uploads/
coverage/
.DS_Store
```

### 3. 데이터베이스 설정

#### MySQL 데이터베이스 생성
```bash
# MySQL 접속
mysql -u root -p

# 데이터베이스 생성
CREATE DATABASE oa_asset_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 사용자 생성 및 권한 부여 (선택사항)
CREATE USER 'oa_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON oa_asset_manager.* TO 'oa_user'@'localhost';
FLUSH PRIVILEGES;

EXIT;
```

#### 마이그레이션 실행
```bash
# 테이블 생성 스크립트 실행
mysql -u root -p oa_asset_manager < migrations/001_create_users.sql
mysql -u root -p oa_asset_manager < migrations/002_create_assets.sql
mysql -u root -p oa_asset_manager < migrations/003_create_inspections.sql
mysql -u root -p oa_asset_manager < migrations/004_create_signatures.sql
```

#### 시드 데이터 삽입 (개발/테스트용)
```bash
npm run db:seed
```

### 4. 개발 서버 실행

#### 개발 모드 (Hot Reload)
```bash
npm run dev
```

출력 예시:
```
[nodemon] starting `ts-node -r tsconfig-paths/register src/index.ts`
🚀 Server is running on http://localhost:3000
📊 Database connected successfully
```

#### 빌드 및 프로덕션 실행
```bash
# TypeScript 컴파일
npm run build

# 프로덕션 실행
npm start

# 또는 환경 변수와 함께
npm run start:prod
```

### 5. API 테스트

#### Health Check
```bash
curl http://localhost:3000/health

# 응답
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected"
}
```

#### 로그인 테스트
```bash
curl -X POST http://localhost:3000/api/v1/auth/social/kakao \
  -H "Content-Type: application/json" \
  -d '{
    "accessToken": "kakao_access_token_from_flutter",
    "provider": "kakao"
  }'

# 응답
{
  "access_token": "jwt_token...",
  "refresh_token": "refresh_token...",
  "expires_in": 3600,
  "user": {
    "id": 1,
    "name": "홍길동",
    "email": "hong@example.com"
  }
}
```

#### Postman/Insomnia Collection
프로젝트 루트에 `api-collection.json` 파일을 생성하여 모든 API 엔드포인트 테스트 가능.

### 6. 개발 워크플로우

#### 새 기능 개발 순서
1. **모델 정의**: `src/models/` 에 TypeScript 인터페이스 작성
2. **Repository 작성**: `src/repositories/` 에 DB 쿼리 로직 작성
3. **Service 작성**: `src/services/` 에 비즈니스 로직 작성
4. **Controller 작성**: `src/controllers/` 에 HTTP 요청 처리 작성
5. **Route 등록**: `src/routes/` 에 엔드포인트 추가
6. **Validator 작성**: `src/validators/` 에 입력 검증 스키마 작성
7. **테스트 작성**: `test/` 에 유닛/통합 테스트 작성

#### 코드 품질 체크
```bash
# Linting
npm run lint

# 자동 수정
npm run lint:fix

# 포맷팅
npm run format

# 테스트
npm test

# 커버리지
npm run test:coverage
```

### 7. Docker 실행 (선택사항)

#### Dockerfile
```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    depends_on:
      - mysql

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: oa_asset_manager
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

#### Docker 실행
```bash
# 빌드 및 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f backend

# 중지
docker-compose down
```

### 8. 트러블슈팅

#### TypeScript 경로 별칭 오류
```bash
# tsconfig-paths 설치 확인
npm install -D tsconfig-paths

# dev 스크립트에 -r tsconfig-paths/register 추가 확인
```

#### MySQL 연결 실패
```bash
# MySQL 서비스 상태 확인
sudo systemctl status mysql  # Linux
brew services list           # macOS

# 방화벽 확인
sudo ufw status             # Linux

# .env 파일 DB 설정 재확인
```

#### 포트 충돌
```bash
# 포트 사용 프로세스 확인
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# 프로세스 종료 또는 .env에서 PORT 변경
```

### 9. 모니터링 및 로깅

#### Winston Logger 설정
```typescript
// src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
```

#### PM2로 프로덕션 실행
```bash
# PM2 설치
npm install -g pm2

# 앱 실행
pm2 start dist/index.js --name oa-backend

# 로그 확인
pm2 logs oa-backend

# 모니터링
pm2 monit

# 재시작
pm2 restart oa-backend

# 자동 시작 설정
pm2 startup
pm2 save
```

## 운영 시나리오
- **초기 데이터 로딩**: 
  - 앱 기동 시 소셜 로그인 수행
  - `/auth/token`으로 JWT 토큰 획득
  - `/assets`, `/inspections`, `/references/users` API를 호출해 초기 데이터 수신
  - 로컬 캐시(sqflite)에 저장
- **오프라인 동작**: 
  - 로컬 캐시에서 데이터 조회
  - 쓰기 작업은 로컬에 저장하고 `synced=false` 플래그 설정
  - 네트워크 복구 시 자동으로 서버에 동기화
- **데이터 동기화**: 
  - `synced=false` 항목을 배치로 서버에 전송
  - 충돌 발생 시 `updated_at` 비교 후 최신 데이터 우선
  - 필요 시 사용자에게 확인 요청

## 용어 정의
- **실사(Inspection)**: 자산 상태 점검 결과. 스캔 시각, 상태, 메모, 사용자 소속 등을 포함.
- **자산(AssetInfo)**: 자산 UID 기반 기본 정보와 자유 형식 메타데이터 맵을 가진 레퍼런스.
- **인증(Verification)**: 서명 수집 및 바코드 사진을 통해 자산 소유/상태를 검증하는 프로세스.
- **동기화(Sync)**: 서버 반영 여부를 나타내는 플래그. 오프라인에서 생성된 데이터를 서버로 전송하는 프로세스.
- **소셜 로그인**: 제3자 플랫폼(카카오, 네이버, 구글, 팀즈)의 계정을 이용한 간편 인증 방식.
