# 백엔드 개발 가이드

> OA Asset Manager 백엔드 서버 개발 및 운영 가이드

## 목차
1. [기술 스택](#기술-스택)
2. [프로젝트 초기 설정](#프로젝트-초기-설정)
3. [TypeScript 완전 가이드](#typescript-완전-가이드)
4. [데이터베이스 설정](#데이터베이스-설정)
5. [개발 시작하기](#개발-시작하기)
6. [API 개발 패턴](#api-개발-패턴)
7. [테스트 작성](#테스트-작성)
8. [배포 가이드](#배포-가이드)

## 기술 스택

### 런타임 & 언어
- **Node.js**: 22.x LTS (2024년 10월 릴리스, 2027년 4월까지 LTS)
- **TypeScript**: 5.3.x (Node.js 22 완벽 호환)

### 주요 프레임워크 & 라이브러리
- **Express**: 4.18.x (웹 프레임워크)
- **mysql2**: 3.6.x (MySQL 드라이버)
- **jsonwebtoken**: 9.0.x (JWT 인증)
- **bcrypt**: 5.1.x (비밀번호 해싱)
- **joi**: 17.11.x (데이터 검증)

### 개발 도구
- **ts-node**: 10.9.x (TypeScript 직접 실행)
- **nodemon**: 3.0.x (파일 변경 감지 재시작)
- **eslint**: 8.x (코드 린팅)
- **prettier**: 3.x (코드 포맷팅)
- **jest**: 29.x (테스트 프레임워크)

## 프로젝트 초기 설정

### 1. Node.js 설치 확인

```bash
# Node.js 버전 확인
node --version
# 출력: v22.x.x

# npm 버전 확인
npm --version
# 출력: 10.x.x
```

**Node.js 22 설치 방법**:
```bash
# nvm 사용 (권장)
nvm install 22
nvm use 22

# 또는 공식 사이트에서 다운로드
# https://nodejs.org/
```

### 2. 프로젝트 생성

```bash
# 프로젝트 폴더 생성
mkdir oa-asset-backend
cd oa-asset-backend

# Git 초기화
git init

# package.json 생성
npm init -y
```

### 3. 의존성 설치

#### 프로덕션 의존성
```bash
npm install express
npm install mysql2
npm install jsonwebtoken bcrypt
npm install dotenv cors
npm install multer
npm install joi express-validator
npm install axios
npm install winston
npm install helmet
npm install compression
```

#### 개발 의존성
```bash
npm install -D typescript
npm install -D @types/node @types/express
npm install -D @types/jsonwebtoken @types/bcrypt
npm install -D @types/cors @types/multer
npm install -D @types/joi
npm install -D ts-node nodemon
npm install -D tsconfig-paths
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
npm install -D jest @types/jest ts-jest
npm install -D supertest @types/supertest
```

**한 번에 설치**:
```bash
npm install express mysql2 jsonwebtoken bcrypt dotenv cors multer joi express-validator axios winston helmet compression && npm install -D typescript @types/node @types/express @types/jsonwebtoken @types/bcrypt @types/cors @types/multer @types/joi ts-node nodemon tsconfig-paths eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-prettier jest @types/jest ts-jest supertest @types/supertest
```

### 4. TypeScript 설정

#### tsconfig.json 생성
```bash
npx tsc --init
```

**추천 tsconfig.json 설정**:
```json
{
  "compilerOptions": {
    // 컴파일 옵션
    "target": "ES2022",                    // Node.js 22가 지원하는 최신 문법
    "module": "commonjs",                   // CommonJS 모듈 시스템
    "lib": ["ES2022"],                      // 사용 가능한 표준 라이브러리
    
    // 출력 설정
    "outDir": "./dist",                     // 컴파일된 JS 파일 출력 위치
    "rootDir": "./src",                     // 소스 파일 루트
    "removeComments": true,                 // 주석 제거
    
    // 모듈 해석
    "moduleResolution": "node",             // Node.js 스타일 모듈 해석
    "baseUrl": "./",                        // 경로 별칭 기준 디렉토리
    "paths": {                              // 경로 별칭 설정
      "@/*": ["src/*"],
      "@controllers/*": ["src/controllers/*"],
      "@services/*": ["src/services/*"],
      "@repositories/*": ["src/repositories/*"],
      "@models/*": ["src/models/*"],
      "@middlewares/*": ["src/middlewares/*"],
      "@routes/*": ["src/routes/*"],
      "@config/*": ["src/config/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    },
    "resolveJsonModule": true,              // JSON 파일 import 허용
    "esModuleInterop": true,                // CommonJS/ES Module 호환성
    "allowSyntheticDefaultImports": true,   // default import 허용
    
    // 타입 체크 (엄격 모드)
    "strict": true,                         // 모든 엄격 체크 활성화
    "noImplicitAny": true,                  // any 타입 암시적 사용 금지
    "strictNullChecks": true,               // null/undefined 엄격 체크
    "strictFunctionTypes": true,            // 함수 타입 엄격 체크
    "strictBindCallApply": true,            // bind/call/apply 엄격 체크
    "strictPropertyInitialization": true,   // 클래스 프로퍼티 초기화 체크
    "noImplicitThis": true,                 // this 타입 명시 강제
    "alwaysStrict": true,                   // 'use strict' 자동 추가
    
    // 추가 체크
    "noUnusedLocals": true,                 // 사용하지 않는 지역 변수 체크
    "noUnusedParameters": true,             // 사용하지 않는 파라미터 체크
    "noImplicitReturns": true,              // 모든 경로에서 return 체크
    "noFallthroughCasesInSwitch": true,     // switch case fall-through 체크
    
    // 실험적 기능
    "experimentalDecorators": true,         // 데코레이터 사용 (TypeORM 등)
    "emitDecoratorMetadata": true,          // 데코레이터 메타데이터 방출
    
    // 기타
    "skipLibCheck": true,                   // d.ts 파일 체크 스킵 (빌드 속도 향상)
    "forceConsistentCasingInFileNames": true // 파일명 대소문자 일관성 강제
  },
  "include": ["src/**/*"],                  // 컴파일 대상 파일
  "exclude": ["node_modules", "dist", "test", "**/*.spec.ts"] // 제외 파일
}
```

#### package.json 스크립트 설정

```json
{
  "name": "oa-asset-backend",
  "version": "1.0.0",
  "description": "OA Asset Manager Backend API with TypeScript",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon",
    "build": "tsc",
    "start": "node dist/index.js",
    "start:prod": "NODE_ENV=production node dist/index.js",
    "clean": "rm -rf dist",
    "rebuild": "npm run clean && npm run build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\"",
    "type-check": "tsc --noEmit",
    "db:migrate": "ts-node src/migrations/run.ts",
    "db:seed": "ts-node src/seeds/run.ts"
  },
  "keywords": ["typescript", "express", "mysql", "asset-management"],
  "author": "Your Name",
  "license": "MIT",
  "engines": {
    "node": ">=22.0.0",
    "npm": ">=10.0.0"
  }
}
```

#### nodemon.json 설정

프로젝트 루트에 `nodemon.json` 파일 생성:
```json
{
  "watch": ["src"],
  "ext": "ts,json",
  "ignore": ["src/**/*.spec.ts", "src/**/*.test.ts"],
  "exec": "ts-node -r tsconfig-paths/register src/index.ts",
  "env": {
    "NODE_ENV": "development"
  }
}
```

### 5. ESLint & Prettier 설정

#### .eslintrc.json
```json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "prettier"],
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "rules": {
    "prettier/prettier": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  },
  "env": {
    "node": true,
    "es6": true
  }
}
```

#### .prettierrc
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

### 6. 환경 변수 설정

#### .env 파일
```env
# Server Configuration
NODE_ENV=development
PORT=3000
API_PREFIX=/api/v1

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=oa_asset_manager
DB_CONNECTION_LIMIT=10

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-refresh-token-secret-min-32-characters
REFRESH_TOKEN_EXPIRES_IN=7d

# Social Login - Kakao
KAKAO_REST_API_KEY=
KAKAO_REDIRECT_URI=http://localhost:3000/api/v1/auth/kakao/callback

# Social Login - Naver
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
NAVER_REDIRECT_URI=http://localhost:3000/api/v1/auth/naver/callback

# Social Login - Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/api/v1/auth/google/callback

# Social Login - Microsoft Teams
TEAMS_CLIENT_ID=
TEAMS_CLIENT_SECRET=
TEAMS_TENANT_ID=common
TEAMS_REDIRECT_URI=http://localhost:3000/api/v1/auth/teams/callback

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
ALLOWED_FILE_TYPES=image/png,image/jpeg

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080

# Logging Configuration
LOG_LEVEL=debug
LOG_DIR=./logs

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### .env.example
```bash
# .env 파일 복사
cp .env .env.example

# .env.example에서 민감한 정보 제거 (Git에 커밋)
```

### 7. .gitignore 설정

```gitignore
# Dependencies
node_modules/
package-lock.json
npm-debug.log*
yarn.lock

# Build output
dist/
build/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Uploads
uploads/*
!uploads/.gitkeep

# Test coverage
coverage/
.nyc_output/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# TypeScript
*.tsbuildinfo
```

## TypeScript 완전 가이드

### 기본 타입 사용

```typescript
// 기본 타입
const name: string = '홍길동';
const age: number = 30;
const isActive: boolean = true;

// 배열
const numbers: number[] = [1, 2, 3];
const users: Array<string> = ['user1', 'user2'];

// 객체
interface User {
  id: number;
  name: string;
  email?: string; // 선택적 속성
}

const user: User = {
  id: 1,
  name: '홍길동',
};

// 함수 타입
function getUser(id: number): User {
  return { id, name: 'User' };
}

// 화살표 함수
const getUserAsync = async (id: number): Promise<User> => {
  return { id, name: 'User' };
};
```

### Interface vs Type

```typescript
// Interface (확장 가능, 선언 병합)
interface IUser {
  id: number;
  name: string;
}

interface IAdmin extends IUser {
  role: string;
}

// Type (유니온, 인터섹션 가능)
type User = {
  id: number;
  name: string;
};

type Admin = User & {
  role: string;
};

// 유니온 타입
type Status = 'pending' | 'approved' | 'rejected';

// 추천: API 응답, 데이터 모델은 interface, 유틸리티 타입은 type
```

### Generics (제네릭)

```typescript
// 제네릭 함수
function wrapInArray<T>(value: T): T[] {
  return [value];
}

wrapInArray<number>(5); // [5]
wrapInArray('hello');    // ['hello'] (타입 추론)

// 제네릭 인터페이스
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const userResponse: ApiResponse<User> = {
  success: true,
  data: { id: 1, name: '홍길동' },
};

// 제네릭 클래스
class Repository<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findById(id: number): T | undefined {
    // 구현
    return undefined;
  }
}

const userRepo = new Repository<User>();
```

### Utility Types (유틸리티 타입)

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Partial - 모든 속성을 선택적으로
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; password?: string; }

// Pick - 특정 속성만 선택
type UserProfile = Pick<User, 'id' | 'name' | 'email'>;
// { id: number; name: string; email: string; }

// Omit - 특정 속성 제외
type UserWithoutPassword = Omit<User, 'password'>;
// { id: number; name: string; email: string; }

// Required - 모든 속성을 필수로
type RequiredUser = Required<PartialUser>;

// Readonly - 모든 속성을 읽기 전용으로
type ReadonlyUser = Readonly<User>;
```

### 실전 예제

#### 1. Express Request/Response 타입 확장

```typescript
// src/types/express.d.ts
import { User } from '@/models/User';

declare global {
  namespace Express {
    interface Request {
      user?: User; // JWT 미들웨어에서 추가
    }
  }
}
```

#### 2. 컨트롤러 타입 정의

```typescript
// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/auth.service';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (
    req: Request<{}, LoginResponse, LoginRequest>,
    res: Response<LoginResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
```

#### 3. Repository 패턴

```typescript
// src/repositories/base.repository.ts
export abstract class BaseRepository<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  abstract findById(id: number): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract create(data: Partial<T>): Promise<T>;
  abstract update(id: number, data: Partial<T>): Promise<T>;
  abstract delete(id: number): Promise<boolean>;
}

// src/repositories/user.repository.ts
import { BaseRepository } from './base.repository';
import { User } from '@/models/User';
import { db } from '@/config/database';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users');
  }

  async findById(id: number): Promise<User | null> {
    const [rows] = await db.query<User[]>(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await db.query<User[]>(
      `SELECT * FROM ${this.tableName} WHERE email = ?`,
      [email]
    );
    return rows[0] || null;
  }

  // 다른 메서드 구현...
}
```

## 데이터베이스 설정

### MySQL 연결 설정

```typescript
// src/config/database.ts
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  waitForConnections: true,
  queueLimit: 0,
});

// 연결 테스트
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};
```

### 마이그레이션 파일

```sql
-- migrations/001_create_users.sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  employee_id VARCHAR(32) UNIQUE NOT NULL,
  name VARCHAR(64) NOT NULL,
  email VARCHAR(128) UNIQUE,
  phone VARCHAR(32),
  provider VARCHAR(20),
  provider_id VARCHAR(128),
  department_hq VARCHAR(64),
  department_dept VARCHAR(64),
  department_team VARCHAR(64),
  department_part VARCHAR(64),
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_provider (provider, provider_id),
  INDEX idx_department (department_team),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 개발 시작하기

### 프로젝트 구조 생성

```bash
mkdir -p src/{config,controllers,services,repositories,models,middlewares,routes,validators,utils,types}
mkdir -p migrations seeds test uploads logs
```

### 최소 실행 코드

#### src/index.ts
```typescript
import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { testConnection } from '@/config/database';
import routes from '@/routes';
import { errorHandler } from '@/middlewares/error.middleware';
import logger from '@/utils/logger';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트
app.use(process.env.API_PREFIX || '/api/v1', routes);

// 에러 핸들러
app.use(errorHandler);

// 서버 시작
const startServer = async () => {
  try {
    // DB 연결 테스트
    await testConnection();

    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on http://localhost:${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
```

#### src/routes/index.ts
```typescript
import { Router } from 'express';
import authRoutes from './auth.routes';
import assetRoutes from './asset.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// API 라우트
router.use('/auth', authRoutes);
router.use('/assets', assetRoutes);

export default router;
```

### 실행

```bash
# 개발 모드
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

[View complete backend setup guide](computer:///mnt/user-data/outputs/backend_setup_guide.md)
