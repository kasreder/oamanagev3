# oamanagev3
# OA Asset Manager 프로젝트 문서

> OA 자산 관리 시스템 - 실사, 인증, 소셜 로그인 통합 플랫폼

## 📚 문서 목록

| 문서명 | 설명 |
|--------|------|
| **[project_overview.md](docs/project_overview.md)** | 프로젝트 전체 개요, 기술 스택, 아키텍처, 프론트엔드/백엔드 폴더 구조 |
| **[api_spec.md]([docs/api_spec.md](https://github.com/kasreder/oamanagev3/blob/main/api_spec.md))** | REST API 명세, 인증, 자산/실사/인증 엔드포인트, 오류 응답 규약 |
| **[db_schema.md](docs/db_schema.md)** | MySQL 8.x 데이터베이스 스키마, 테이블 정의, 인덱스, 마이그레이션 가이드 |
| **[feature_spec.md](docs/feature_spec.md)** | 기능 명세, 페이지별 화면 설명, 소셜 로그인 플로우, API 연동 동작 |
| **[ui_ux_spec.md](docs/ui_ux_spec.md)** | UI/UX 디자인 가이드, 컴포넌트 설계, 색상/타이포그래피, 반응형 레이아웃 |
| **[vibe_prompt_spec.md](docs/vibe_prompt_spec.md)** | AI 코딩 도우미용 프롬프트, 구현 가이드라인, 코드 스타일, 테스트 규칙 |
| **[backend_setup_guide.md](docs/backend_setup_guide.md)** | 백엔드 완전 가이드, TypeScript 설정, 개발 환경 구축, 실행 방법 |

## 🚀 빠른 시작

### 프론트엔드 (Flutter)
```bash
cd frontend
flutter pub get
flutter run
```

### 백엔드 (Node.js + TypeScript)
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## 🛠 기술 스택

- **Frontend**: Flutter 3.29, Dart
- **Backend**: Node.js 22.x, TypeScript 5.3.x, Express
- **Database**: MySQL 8.x
- **Authentication**: JWT, 소셜 로그인 (카카오, 네이버, 구글, 팀즈)

## 📖 문서 읽기 순서 (추천)

1. **project_overview.md** - 전체 프로젝트 이해
2. **backend_setup_guide.md** - 백엔드 개발 환경 구축
3. **db_schema.md** - 데이터베이스 설계 파악
4. **api_spec.md** - API 엔드포인트 확인
5. **feature_spec.md** - 기능 상세 이해
6. **ui_ux_spec.md** - UI 디자인 가이드
7. **vibe_prompt_spec.md** - 개발 시 코딩 규칙

## 📝 라이선스

MIT License
