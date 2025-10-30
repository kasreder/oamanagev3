# UI·UX 설계 문서

## 디자인 원칙
- **일관된 네비게이션**: AppScaffold가 화면 크기에 따라 NavigationRail/Drawer/BottomNavigationBar를 전환, 동일한 메뉴 구성을 유지한다.
- **오프라인 친화 UI**: 로딩 지표보다 상태 배지를 강조하여 데이터 최신 여부와 관계없이 작업 가능하도록 설계.
- **가독성 우선**: DataTable, Card, Chip 등을 활용해 표 형태 정보를 명확히 구분. 텍스트는 Material 3 기본 폰트 크기에서 -1~0 조정.
- **즉각 피드백**: SnackBar, Chip, IconButton 상태로 작업 성공/실패를 즉시 전달한다.
- **접근성 고려**: 모든 상호작용 요소에 Icon+Text 조합, 최소 44px 터치 영역을 확보.
- **브랜드 일관성**: 소셜 로그인 버튼은 각 플랫폼의 공식 브랜딩 가이드를 준수.

## 레이아웃 가이드
| 구분 | 모바일(<450px) | 태블릿/데스크톱(≥450px) |
| --- | --- | --- |
| AppBar | 상단 고정, 햄버거 메뉴+설정 아이콘 | 동일 |
| 네비게이션 | BottomNavigationBar + Drawer | NavigationRail + Drawer |
| 컨텐츠 폭 | 기본 padding 16 | 카드/테이블은 1200px까지 확장 |
| 하단 CTA | ScannedFooter 버튼 고정 | NavigationRail 옆 본문 하단에 배치 |

## 공통 컴포넌트

### AppScaffold
- **Header**: 제목, 오프라인 상태 배지, 설정 아이콘
- **Navigation**: 메뉴 5개(홈/자산리스트/자산인증/자산등록/프로필)
- **Footer**: `ScannedFooter` (QR 버튼) → 모바일에서는 BottomNavigationBar 위, 데스크톱에서는 본문 하단
- **오프라인 배지**: AppBar에 작은 Chip 형태로 표시, 주황색 배경

### 카드(Card)
- 섹션 구분, 16px padding, 제목은 `titleMedium`, 내용은 `bodyMedium`
- elevation 1~2, rounded corners 12px

### 데이터 테이블
- 헤더 높이 40px, 본문 40px
- 열 간격 최소화(0~8px)로 정보 밀도 증가
- 스크롤바 항상 표시하여 긴 목록 탐색 용이
- 행 호버 시 배경색 변경

## 페이지별 UX

### 로그인
- **레이아웃**: 중앙 정렬, 최대 폭 400px
- **구성 요소**:
  - 앱 로고 (120x120px)
  - 앱 타이틀 및 서브타이틀
  - 소셜 로그인 버튼 4개 (세로 배치, 간격 12px)
    - 카카오: 노란색 배경 (#FEE500), 검정 텍스트
    - 네이버: 초록색 배경 (#03C75A), 흰색 텍스트
    - 구글: 흰색 배경, 테두리, 컬러 로고, 검정 텍스트
    - Teams: 보라색 배경 (#6264A7), 흰색 텍스트
  - 각 버튼 높이 48px, 너비 100%, rounded 8px
  - 로딩 시 버튼 비활성화 및 CircularProgressIndicator 표시
- **상호작용**:
  - 버튼 탭 시 해당 플랫폼 인증 플로우 시작
  - 오류 시 버튼 하단에 빨간 텍스트로 오류 메시지 표시
  - 성공 시 홈 화면으로 자동 이동

### 홈
- **히어로 섹션**: 2x2 카드 그리드 (모바일에서는 1열). 아이콘+제목+설명
  - 사용자 정보 카드 (이름, 부서, 로그인 플랫폼 아이콘)
  - 실사 통계 카드 (총 건수, 미동기화 건수)
- **최근 실사**: ListTile 카드. 상태/시간을 서브타이틀로, 모델명을 trailing 텍스트로 표시
- **빈 상태**: "최근 실사 기록이 없습니다" 카드
- **새로고침**: Pull-to-refresh로 서버 동기화

### QR 스캔
- **뷰파인더**: MobileScanner 전 화면. 토치/카메라 전환 FloatingActionButton 스타일 버튼 배치
- **상태 표시**: 권한 거부 시 전체 화면 안내와 설정 이동 버튼
- **최근 스캔 패널**: 하단 Sheet 스타일(최근 5건, 등록 여부 칩, 썸네일)
- **피드백**: 스캔 성공 시 진동+비프음, UI에 강조 색상 (초록 테두리 애니메이션)

### 자산 목록
- **필터 영역**: Card + Wrap. 검색 입력, 필드 드롭다운, 미동기화 스위치, 건수 배지, 초기화 버튼
- **새로고침 버튼**: 우측 상단에 IconButton (Icons.refresh)
- **테이블 영역**: 가로 스크롤 지원, 컬럼 폭 지정(메모/위치는 200px)
- **동기화 상태 컬럼**: Chip으로 표시 (동기화됨: 초록, 대기중: 주황)
- **페이징 컨트롤**: 중앙 정렬, Prev/Next 아이콘 버튼, 현재 페이지 Bold
- **빈 상태**: "표시할 실사 내역이 없습니다" 텍스트 + 자산 등록 버튼

### 자산 상세
- **검색 카드**: TextField + 검색 버튼. 결과 없을 때 빨간 안내 텍스트
- **자산 정보 카드**: 기본 필드+메타데이터를 정보 행으로 배치. 편집 모드 시 TextFormField로 교체
- **실사 메타 카드**: 상태/최근 실사 일시, 동기화 여부 Chip, 증빙 링크
- **변경 이력**: Timeline 위젯으로 표시 (최근 5건)
- **액션 영역**: 수정/취소/저장/삭제 버튼. 삭제는 TextButton+빨간색
- **로딩 상태**: Skeleton screen 또는 Shimmer effect

### 자산 등록
- **폼 레이아웃**: 두 열(Grid) 이상 화면에서는 좌측 폼, 우측 미리보기 카드. 모바일은 순차 배치
- **메타데이터 입력**: 동적 필드 추가/삭제 버튼(OutlinedButton, IconButton)
- **검증 메시지**: 필수 입력 미기재 시 TextFormField 하단에 오류 텍스트
- **QR 코드 미리보기**: 등록 완료 후 생성된 QR 코드 표시
- **저장 후 피드백**: SnackBar로 성공/실패 전달, 폼 초기화 옵션 안내

### 자산 인증 목록
- **필터 패널**: 컬럼 선택 라디오 버튼, 검색창, 적용/초기화 버튼
- **테이블**: 체크박스 열(선택), 팀/사용자/장비/위치/서명/바코드 컬럼
- **서명/사진 여부 표시**: Chip (확인: 초록, 미등록: 주황, 오류: 빨강)
- **선택 요약**: 상단에 "선택 n건" 텍스트, 그룹 인증 버튼을 우측 배치
- **진행 상태**: 일괄 작업 진행 시 LinearProgressIndicator 표시

### 자산 인증 상세
- **정보 테이블**: DataTable 한 행으로 세부 정보 표현. Chip으로 상태/사진 여부 강조
- **서명/바코드 섹션**: Expansion 패널 스타일. 이미지 없을 때 안내 Chip
- **작업 섹션**: VerificationActionSection → 서명 캡처, 파일 업로드, PDF, 공유, 초기화
- **로딩 상태**: FutureBuilder 대기 중일 때 CircularProgressIndicator
- **인증 완료 버튼**: 모든 증빙 완료 시 활성화, 초록색 FilledButton

### 선택 자산 인증
- **요약 카드**: 선택 자산 목록을 카드 그리드로 표시(최대 3열)
- **각 카드 구성**: 사용자/팀/사진/서명 상태 Chip
- **경고 영역**: 누락 자산은 빨간 텍스트로 상단 표시
- **진행 상황**: 처리된 자산 / 전체 자산 비율 표시
- **하단 액션**: VerificationActionSection 확장/축소 토글, 공통 서명 진행
- **완료 후**: 자동으로 서버 동기화 및 완료 다이얼로그

### 프로필
- **레이아웃**: 중앙 정렬 카드, 최대 폭 600px
- **구성 요소**:
  - 프로필 아이콘 (64x64px)
  - 사용자 이름 (titleLarge)
  - 이메일, 부서 정보 (bodyMedium)
  - 로그인 플랫폼 배지 (Chip with icon)
  - 로그아웃 버튼 (OutlinedButton, 빨간 텍스트)
  - 앱 버전 정보 (하단, bodySmall)
- **로그아웃 확인**: AlertDialog로 확인 요청

## 색상 및 타이포그래피

### Color Scheme
- **Primary**: Indigo (Material3 기본)
- **Secondary**: Teal
- **상태 색상**:
  - 정상/확인: `colorScheme.primary` (파랑/초록)
  - 경고/미완료: `Colors.orange[700]`
  - 오류/삭제: `colorScheme.error` (빨강)
  - 오프라인: `Colors.grey[600]`

### 소셜 로그인 브랜드 색상
- 카카오: `#FEE500` (배경), `#000000` (텍스트)
- 네이버: `#03C75A` (배경), `#FFFFFF` (텍스트)
- 구글: `#FFFFFF` (배경), `#000000` (텍스트), border `#DADCE0`
- Teams: `#6264A7` (배경), `#FFFFFF` (텍스트)

### Typography
- **폰트**: 기본 Roboto/Noto Sans
- **크기**:
  - 제목: 20~24pt (titleLarge)
  - 본문: 14~16pt (bodyMedium)
  - 테이블: 13pt (bodySmall)
  - 캡션: 12pt (caption)

## 아이콘 가이드

### 네비게이션
- 홈: `Icons.home`
- 자산 목록: `Icons.list_alt`
- 인증: `Icons.verified`
- 등록: `Icons.add_box_outlined`
- 프로필: `Icons.person`

### 기능
- QR 스캔: `Icons.qr_code_scanner`
- 검색: `Icons.search`
- 필터: `Icons.filter_alt`
- 새로고침: `Icons.refresh`
- 로그아웃: `Icons.logout`
- 서명: `Icons.draw`
- 사진: `Icons.photo_camera`
- 동기화: `Icons.cloud_upload`, `Icons.cloud_done`

### 상태
- 성공: `Icons.check_circle` (초록)
- 경고: `Icons.warning` (주황)
- 오류: `Icons.error` (빨강)
- 대기: `Icons.schedule` (회색)

## 상호작용 패턴

### SnackBar
- 3초 지속
- 하단 중앙 배치
- 액션 버튼 최대 1개
- 오류는 빨간 배경, 성공은 초록 배경

### Dialog
- **확인 다이얼로그**: 파괴적 행동(삭제, 로그아웃)에 사용
- **정보 다이얼로그**: 중요 안내사항
- **버튼 배치**: 취소(좌), 확인(우)

### Chip
- 상태 표시용
- 배경색은 상태별 투명도 0.15 적용
- 아이콘과 텍스트 조합

### 폼 제출
- 유효성 검증 실패 시 첫 오류 필드로 포커스 이동
- 제출 중 버튼 비활성화 및 로딩 인디케이터

### Pull-to-Refresh
- 홈, 자산 목록에서 지원
- 아래로 당겨서 서버 동기화
- 진행 중 CircularProgressIndicator 표시

## 반응형 디자인

### 브레이크포인트
- **모바일**: < 450px
- **태블릿**: 450px ~ 900px
- **데스크톱**: > 900px

### 적응형 레이아웃
- 모바일: 1열 카드, BottomNavigationBar
- 태블릿: 2열 카드, NavigationRail
- 데스크톱: 3열 카드, NavigationRail + 확장된 Drawer

## 애니메이션

### 페이지 전환
- Material 기본 전환 (슬라이드)
- 300ms duration

### 로딩
- Skeleton screen (목록 페이지)
- CircularProgressIndicator (상세 페이지)
- Shimmer effect (카드 placeholder)

### 피드백
- 버튼 탭: Ripple effect
- 성공: 체크 아이콘 페이드인
- 오류: Shake animation

## 접근성(Accessibility)

### 시각
- 최소 대비율 4.5:1 (WCAG AA)
- 터치 영역 최소 44x44px
- 명확한 아이콘+텍스트 조합

### 스크린 리더
- Semantics 위젯 적용
- 모든 이미지에 대체 텍스트
- 적절한 heading 구조

### 키보드 네비게이션
- Tab 순서 논리적 구성
- Focus indicator 명확히 표시

## 오프라인 UX

### 상태 표시
- AppBar에 오프라인 배지 (주황색 Chip)
- 동기화 대기 항목은 별도 아이콘 표시

### 데이터 접근
- 캐시된 데이터로 정상 작업 가능
- 네트워크 필요 작업은 버튼 비활성화

### 동기화
- 네트워크 복구 시 자동 동기화
- 진행 상황 ProgressIndicator로 표시
- 완료 후 SnackBar 알림

## 에러 상태

### 네트워크 오류
- 전용 에러 화면 (아이콘+메시지+재시도 버튼)
- 부분 오류는 SnackBar

### 데이터 없음
- 친절한 빈 상태 화면
- 관련 액션 버튼 제공

### 권한 오류
- 명확한 설명과 설정 이동 버튼

## 성능 최적화

### 이미지
- 적절한 해상도 사용
- 캐싱 활성화
- Lazy loading

### 목록
- 페이지네이션 또는 무한 스크롤
- ListView.builder 사용
- 항목당 최소 렌더링

### 애니메이션
- 60fps 유지
- 복잡한 애니메이션은 옵션으로

## 향후 개선 제안
- 다국어 지원(i18n) → `intl` 패키지 활용
- 다크 모드 완전 지원
- 테이블 열 고정 및 CSV 내보내기
- 고급 필터 (날짜 범위, 다중 선택)
- 대시보드 차트 및 통계
- Push 알림 (동기화 완료, 할당된 작업 등)
