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
- **백엔드 플랫폼**: Node.js 22.x
- **데이터베이스**: MySQL 8.x
- **주요 사용자**: OA 자산 실사자, IT 자산 관리자, 인증 담당자
- **핵심 기능 영역**
  1. 소셜 로그인 인증 (카카오, 네이버, 구글, 팀즈)
  2. 자산 실사 현황 조회 및 편집
  3. 자산 스캔/등록 및 메타데이터 관리
  4. 인증(서명·바코드 사진) 수집 및 배치 검증
  5. 사용자/조직 참조 데이터 활용을 통한 검색 및 자동 입력

## 아키텍처 개요
| 계층 | 구성 요소 | 설명 |
| --- | --- | --- |
| 프레젠테이션 | `lib/view/**` | AppScaffold로 감싼 페이지들이 GoRouter 경로에 매핑되어 있으며, Consumer/Provider 패턴으로 상태를 구독한다. |
| 상태 관리 | `lib/providers/**` | InspectionProvider가 자산·사용자 레퍼런스, 실사 목록, 필터 상태를 보유하고 ChangeNotifier로 라우터 및 UI를 갱신한다. AuthProvider가 소셜 로그인 상태를 관리한다. |
| 데이터 | `lib/data/**` | InspectionRepository가 REST API를 통해 데이터를 조회/수정하고, SignatureStorage가 플랫폼별(웹/모바일)로 서명 파일을 저장한다. |
| 모델 | `lib/models/**` | Inspection, Asset, User 등 엔터티를 정의하고 JSON 변환, copyWith 로직을 제공한다. |
| 라우팅 | `lib/router/app_router.dart` | GoRouter 기반의 경로 정의 및 오류 처리, 인증 상태에 따른 리다이렉트 처리. |

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
