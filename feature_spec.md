# 기능 명세

## 라우팅 요약
| 경로 | 화면 | 주요 위젯 | 상태 의존성 |
| --- | --- | --- | --- |
| `/login` | 로그인 | `LoginPage`, 소셜 로그인 버튼 그룹 | `AuthProvider.login`, `isAuthenticated` |
| `/` | 홈 | `HomePage`, `AppScaffold`, `_HomeCard` | `InspectionProvider.items`, `recent`, `unsyncedCount` |
| `/scan` | QR 스캔 | `ScanPage`, `MobileScanner`, 최근 스캔 목록 | `InspectionProvider.assetExists`, `addOrUpdate` |
| `/assets` | 자산 목록 | `AssetsListPage`, `DataTable`, `_FilterSection` | `InspectionProvider.items`, `assetOf`, `setOnlyUnsynced` |
| `/assets/:id` | 자산 상세 | `AssetsDetailPage`, 검색/수정 폼, 메타데이터 카드 | `InspectionProvider.findById`, `assetOf`, `upsertAssetInfo` |
| `/assets/register` | 자산 등록 | `AssetRegistrationPage`, 등록 폼, 미리보기 | `InspectionProvider.assetExists`, `upsertAssetInfo` |
| `/asset_verification_list` | 인증 목록 | `AssetVerificationListPage`, 배치 선택, 페이징 테이블 | `InspectionProvider.items`, `assetOf`, `userOf` |
| `/asset_verification/:assetUid` | 인증 상세 | `AssetVerificationDetailPage`, 서명/바코드 영역 | `InspectionProvider.latestByAssetUid`, `assetOf` |
| `/asset_verification_group` | 인증 그룹 | `AssetVerificationDetailsGroupPage`, 다중 자산 카드 | `InspectionProvider.assetOf`, `latestByAssetUid` |
| `/profile` | 프로필 | `ProfilePage`, 사용자 정보, 로그아웃 | `AuthProvider.user`, `logout` |

## 인증(Authentication)

### 로그인(LoginPage)
- **목표**: 소셜 로그인을 통한 사용자 인증.
- **기능**
  - 카카오, 네이버, 구글, 팀즈 로그인 버튼 제공
  - 각 플랫폼별 SDK를 통한 OAuth 인증
  - 인증 성공 시 JWT 토큰 획득 및 secure storage 저장
  - 자동 로그인 옵션 (토큰 유효성 확인)
- **UI 구성**
  - 앱 로고 및 타이틀
  - 4개의 소셜 로그인 버튼 (각 플랫폼 브랜딩 색상)
  - 로딩 인디케이터
- **오류 처리**
  - 네트워크 오류 시 재시도 안내
  - 권한 거부 시 안내 메시지
  - 서버 오류 시 SnackBar 표시

### 프로필(ProfilePage)
- **목표**: 사용자 정보 표시 및 계정 관리.
- **기능**
  - 현재 로그인된 사용자 정보 표시 (이름, 이메일, 부서)
  - 로그인 플랫폼 표시 (카카오/네이버/구글/팀즈)
  - 로그아웃 버튼
  - 앱 버전 정보
- **로그아웃 처리**
  - 확인 다이얼로그 표시
  - JWT 토큰 삭제
  - 소셜 플랫폼 SDK 로그아웃 호출
  - 로그인 화면으로 리다이렉트

## 홈(HomePage)
- **목표**: 주요 업무로 이동하는 허브 화면.
- **기능**
  - 최근 실사 5건을 카드 목록으로 표시하고 상세 화면으로 이동
  - 실사 총계/미동기화 건수를 요약 카드에 표시
  - 빠른 진입용 버튼(스캔, 자산 목록, 미동기화, 자산 등록) 제공
  - 사용자 정보 요약 (이름, 부서)
- **상호작용**: 카드 탭 시 해당 라우트로 이동(`context.go`)

## QR 스캔(ScanPage)
- **목표**: QR/바코드 스캔으로 실사 데이터를 빠르게 수집.
- **기능**
  - MobileScanner를 통해 카메라 입력을 수신하고 권한 체크
  - 스캔 결과에서 자산 UID를 추출(JSON 또는 텍스트) 후 최근 5개 내역으로 관리
  - 스캔 시 자산 등록 여부에 따라 피드백 사운드/진동 제공
  - 촬영 이미지에서 프레임 캡처 후 미리보기 썸네일 저장
  - 토치 제어, 카메라 전환, 스캔 일시정지/재개, 권한 오류 안내
- **후속 액션**: 실사 상세로 이동하거나 자산 등록 경로에 UID 쿼리 전달 가능

## 자산 목록(AssetsListPage)
- **목표**: 실사 결과와 자산 정보를 통합 조회/검색.
- **기능**
  - 실시간 필터: 검색 필드(자산번호/사용자/장비종류/모델명/소속팀) 선택 후 텍스트 검색
  - 미동기화 필터 토글(`InspectionProvider.onlyUnsynced`) 및 전체 카운트 표시
  - DataTable 기반 그리드로 주요 속성(상태, 위치, 메모 등) 열 표시. 가로/세로 스크롤, 페이징(20행)
  - 행 선택 시 자산 상세(`/assets/{inspection.id}`) 이동
  - 새로고침 버튼으로 서버 동기화
- **오프라인 모드**: 로컬 캐시 데이터 표시, 네트워크 상태 배지

## 자산 상세(AssetsDetailPage)
- **목표**: 특정 자산의 실사 기록 및 메타데이터를 조회/편집.
- **기능**
  - asset_uid 검색 후 실사/자산 정보를 로드. 없는 경우 경고
  - 자산 기본 필드와 메타데이터를 카드 형태로 표시, 편집 모드에서 FormField 입력 가능
  - 실사 상태, 메모 수정 및 저장(InspectionProvider.addOrUpdate)
  - 자산 참조 정보 수정 시 Provider.upsertAssetInfo로 반영
  - 삭제 확인 다이얼로그를 통해 실사 삭제 및 목록 페이지로 복귀
  - 변경 이력 타임라인 표시

## 자산 등록(AssetRegistrationPage)
- **목표**: 신규 자산 생성 또는 기존 자산 덮어쓰기.
- **기능**
  - UID/사용자/모델/위치/상태 등 필수 입력과 메타데이터 키-값 입력을 Form으로 구성
  - 실시간 미리보기 카드로 저장될 데이터를 확인
  - 동일 UID 존재 시 경고 다이얼로그 후 덮어쓰기 선택 가능
  - 저장 성공 시 SnackBar 안내 및 폼 초기화
  - QR 코드 자동 생성 및 인쇄 준비

## 자산 인증 목록(AssetVerificationListPage)
- **목표**: 실사 자산의 인증 상태(서명/바코드 사진)를 일괄 검토.
- **기능**
  - 팀/사용자/자산번호 등 컬럼별 검색과 필터 초기화
  - 페이지당 20건, 체크박스 선택을 통한 그룹 액션 대상 지정
  - BarcodePhotoRegistry로 로컬 자산 사진 여부 표시, SignatureStorage로 서명 존재 여부 캐시
  - 선택 항목을 `/asset_verification_group` 페이지로 전달
  - 서명 미완료/사진 미등록 항목 강조 표시

## 자산 인증 상세(AssetVerificationDetailPage)
- **목표**: 단일 자산의 인증 상태 및 증빙 자료 관리.
- **기능**
  - 실사/자산 데이터를 종합하여 팀/사용자/장비/위치 등 정보를 테이블로 제공
  - 비동기 FutureBuilder로 바코드 사진 경로 및 서명 데이터를 로드
  - `VerificationActionSection`을 통해 서명 캡처, 저장, 공유, PDF 생성 등의 후속 작업 인터페이스 제공
  - 서명/사진 섹션 접기/펼치기 토글
  - 인증 완료 상태 업데이트

## 선택 자산 인증(AssetVerificationDetailsGroupPage)
- **목표**: 다수 자산을 한 화면에서 검토하고 일괄 서명을 진행.
- **기능**
  - 쿼리 파라미터로 전달된 asset_uid 목록을 중복 제거 후 카드로 정리
  - 각 항목에 대해 실사/자산/사용자 정보를 결합 표시, 누락된 자산 경고
  - BarcodePhotoRegistry를 이용해 사진 유무 확인
  - VerificationActionSection을 공유 영역으로 사용해 여러 자산의 서명을 한 번에 처리
  - 그룹 인증 완료 후 서버 동기화

## 공통 컴포넌트

### AppScaffold
- 네비게이션 드로어/바텀 탭/NavigationRail을 제공하며 ScannedFooter를 통해 QR 스캔 CTA를 고정
- 인증 상태에 따른 메뉴 표시 조절
- 오프라인 상태 배지 표시

### ScannedFooter
- 하단 SafeArea 안에서 QR 스캔 라우트로 이동하는 버튼 제공

### SignatureStorage
- 웹/모바일 간 추상화된 서명 저장소
- PNG 변환 및 서버 업로드 처리
- 로컬 캐시와 원격 동기화 관리

### BarcodePhotoRegistry
- 로컬 및 서버의 바코드 사진 경로를 관리
- 인증 페이지에서 활용

## API 연동 동작

### 데이터 소스
- 모든 페이지는 REST API를 통해 데이터를 조회
- `InspectionProvider`는 초기 로딩 시 서버에서 데이터를 가져오고, 로컬 캐시(sqflite)에 저장
- UI는 로컬 캐시를 구독하여 즉시 응답

### 쓰기 작업
- 실사 저장, 자산 등록, 서명 업로드는 서버 API를 호출
- Optimistic UI로 즉시 반영, 실패 시 롤백
- 성공 응답 확인 후 로컬 캐시 업데이트

### 검색/필터
- 서버 페이징을 활용하여 목록 페이지의 페이지네이션·필터 입력 시 API 호출
- 로컬 캐시는 최근 요청 결과를 저장

### 오프라인 처리
- 네트워크가 끊기면 캐시 DB를 읽어 UI를 유지
- 쓰기 작업은 로컬 큐에 저장하고 `synced=false` 표시
- 재연결 시 `InspectionProvider`가 큐의 변경분을 서버에 순차 업로드
- 동기화 진행 상황을 ProgressIndicator로 표시

### 인증 처리
- 모든 API 요청에 JWT 토큰을 Authorization 헤더에 포함
- 401 응답 시 refresh token으로 재인증 시도
- 실패 시 로그인 화면으로 리다이렉트

## 에러 핸들링

### 네트워크 오류
- SnackBar로 사용자에게 알림
- 재시도 버튼 제공
- 오프라인 모드로 자동 전환

### 서버 오류
- 오류 코드별 적절한 메시지 표시
- 감사 로그에 오류 기록
- 필요시 관리자 알림

### 데이터 충돌
- 서버와 로컬 데이터 불일치 시 사용자에게 선택 요청
- `updated_at` 기준으로 최신 데이터 우선 제안

## 보안 고려사항

### 토큰 관리
- JWT 토큰은 flutter_secure_storage에 암호화 저장
- 앱 종료 시에도 유지
- 로그아웃 시 완전 삭제

### 민감 정보 보호
- 서명 이미지는 암호화하여 저장
- API 통신은 HTTPS 필수
- 로컬 DB는 SQLCipher로 암호화

### 권한 관리
- 사용자 역할별 기능 접근 제어
- API 레벨에서 권한 검증
