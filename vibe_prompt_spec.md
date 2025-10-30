# VIBE AI 코딩 프롬프트 명세

본 문서는 OA Asset Manager 코드베이스를 수정할 때 AI Pair Programmer에게 전달할 기본 지침을 정의한다.

## 1. 컨텍스트 제공

### 프로젝트 개요
- Flutter 기반 OA 자산 관리 앱
- Provider + GoRouter 구조, Material 3 디자인 시스템
- MySQL 8.x 백엔드 연동
- 소셜 로그인 지원 (카카오, 네이버, 구글, 팀즈)
- 오프라인 우선 아키텍처 (로컬 캐시 + 서버 동기화)

### 핵심 폴더
- `lib/data`: API 클라이언트, 서명 스토리지, 로컬 캐시
- `lib/providers`: 상태 관리 (InspectionProvider, AuthProvider)
- `lib/view`: 페이지 및 공통 위젯
- `lib/models`: 데이터 모델 (Inspection, Asset, User)
- `lib/services`: 인증, 동기화 등 비즈니스 로직

### 실행 방법
```bash
# 의존성 설치
flutter pub get

# 개발 실행
flutter run -d chrome  # 웹
flutter run -d macos   # 데스크톱
flutter run            # 모바일 (연결된 기기)

# 빌드
flutter build apk      # Android
flutter build ios      # iOS
flutter build web      # Web
```

## 2. 작업 정의 템플릿

AI에게 작업을 지시할 때 아래 템플릿을 사용한다:

```
목표: <사용자 스토리 또는 버그 설명>
범위: <수정/추가 대상 경로>
제약: <디자인, 성능, 접근성 요구사항>
테스트: <필수 실행 테스트/명령>
산출물: <코드/문서/이미지 등>
```

예시:
```
목표: 카카오 로그인 기능 구현
범위: lib/services/auth_service.dart, lib/view/login_page.dart
제약: kakao_flutter_sdk 사용, 에러 처리 필수
테스트: flutter test test/services/auth_service_test.dart
산출물: 코드 + 테스트 케이스
```

## 3. 구현 가이드라인

### 상태 관리
- `InspectionProvider`, `AuthProvider`를 재사용하고 필요 시 메서드 추가
- 다른 상태관리 패턴(BLoC, Riverpod)을 도입하지 않음
- `notifyListeners()` 호출 시점 명확히

### 데이터 접근
- REST API 통신은 `InspectionRepository` 또는 새 Repository 클래스로 캡슐화
- 로컬 캐시는 sqflite 사용
- 네트워크 지연을 고려한 optimistic update 구현
- 오프라인 큐 관리 (`synced` 플래그 활용)

### 인증 처리
- 소셜 로그인은 각 플랫폼 SDK 사용:
  - 카카오: `kakao_flutter_sdk`
  - 네이버: `flutter_naver_login`
  - 구글: `google_sign_in`
  - 팀즈: OAuth2 flow 또는 `microsoft_auth`
- JWT 토큰은 `flutter_secure_storage`에 저장
- 모든 API 요청에 `Authorization: Bearer <token>` 헤더 포함
- 401 응답 시 refresh token으로 재인증
- 실패 시 로그인 화면으로 리다이렉트

### UI 작성 규칙
- AppScaffold를 최상단에 배치
- Material 3 컴포넌트 사용 (FilledButton, NavigationBar 등)
- 반응형을 고려하여 `MediaQuery.sizeOf` 기반 조건 분기
- 소셜 로그인 버튼은 각 플랫폼 브랜딩 가이드 준수
- 오프라인 상태 배지 표시
- 로딩 상태는 Skeleton screen 또는 Shimmer effect

### 서명/파일 처리
- `SignatureStorage` 추상화를 통해 저장
- 직접 `dart:io` 접근 금지
- 서버 업로드 시 presigned URL 활용

### 국제화
- 현재 한글 UI 유지
- 새 텍스트도 한글 기본
- 향후 다국어 대응을 위해 하드코딩 최소화
- DateFormat은 `InspectionProvider.formatDateTime` 재사용

### 코드 스타일
- `const` 생성자/위젯 적극 사용
- `final` 기본, 필요한 경우에만 `var`
- `dartfmt`(Flutter format)에 맞춘 trailing comma
- import 순서: Flutter → 패키지 → 프로젝트 상대 경로
- 주석은 한글로 작성

### 오류 처리
- 사용자 피드백은 SnackBar/AlertDialog 활용
- 비동기 함수는 `try/catch`로 사용자 메시지 제공
- 디버그 로그는 `if (kDebugMode)` 조건으로 감싼다
- 네트워크 오류는 재시도 옵션 제공
- 서버 오류는 적절한 메시지와 함께 로깅

### API 연동
- 모든 API 호출은 Repository 패턴 사용
- 요청/응답 로깅 (개발 모드)
- Timeout 설정 (30초)
- 재시도 로직 (최대 3회)
- 에러 코드별 처리

### 보안
- 민감 정보는 secure storage에 암호화 저장
- API 키는 환경 변수 또는 `.env` 파일 사용
- 토큰은 메모리에 최소 시간만 보관
- 로그에 민감 정보 출력 금지

## 4. 테스트 지침

### 필수 테스트
```bash
flutter analyze         # 정적 분석
flutter test           # 유닛 테스트
flutter test --coverage # 커버리지
```

### 테스트 작성 원칙
- 모든 Repository, Service는 유닛 테스트 작성
- Provider는 상태 변화 테스트
- UI는 위젯 테스트 (중요 플로우)
- 모의 객체(Mock)는 `mockito` 사용

### 통합 테스트
- 인증 플로우 E2E 테스트
- API 연동 테스트 (스테이징 환경)
- 오프라인 동기화 시나리오 테스트

## 5. 코드 리뷰 체크리스트

- [ ] 상태 변경 후 `notifyListeners()` 호출 확인
- [ ] 라우터 경로/파라미터가 정의된 규칙과 일치하는가?
- [ ] SignatureStorage 호출 시 플랫폼별 경로 고려했는가?
- [ ] UI 반응형 분기(≥450px)에서 레이아웃 깨짐이 없는가?
- [ ] API 호출 시 에러 처리 및 로딩 상태 관리했는가?
- [ ] 인증 토큰 만료 처리가 올바른가?
- [ ] 오프라인 큐 동기화 로직이 정상 동작하는가?
- [ ] 민감 정보가 로그나 화면에 노출되지 않는가?
- [ ] 소셜 로그인 버튼이 브랜딩 가이드를 준수하는가?
- [ ] 테스트 케이스가 작성되었는가?

## 6. 커밋/PR 정책

### 커밋 메시지
Conventional Commits 규칙 준수:
```
feat: 새 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅 (로직 변경 없음)
refactor: 리팩토링
test: 테스트 추가/수정
chore: 빌드, 설정 등
```

예시:
```
feat: 카카오 로그인 기능 구현
fix: 토큰 갱신 시 무한 루프 버그 수정
docs: API 명세에 인증 엔드포인트 추가
```

### PR 템플릿
```markdown
## Summary
- 변경 요약 2~3줄

## Changes
- 구체적인 변경 사항 나열

## Testing
- [ ] flutter analyze
- [ ] flutter test
- [ ] 수동 테스트 완료
- [ ] 기타: ___

## Screenshots (UI 변경 시)
- Before/After 스크린샷 첨부

## Related Issues
- Closes #123
```

## 7. 금지 사항

### 절대 금지
- Provider 외 다른 상태관리 도입 (Bloc, Riverpod 등)
- 직접적인 파일 시스템 접근 (`dart:io` 직접 사용)
- 하드코딩된 절대 경로
- API 키, 비밀번호 등 민감 정보 소스코드에 포함
- 동기 I/O 작업 (특히 UI 스레드)
- `print()` 사용 (디버그는 `debugPrint()`)

### 권장하지 않음
- 과도한 중첩 위젯 (3depth 이상)
- 거대한 단일 파일 (500줄 이상)
- 전역 변수 사용
- 불필요한 의존성 추가

## 8. 플랫폼별 고려사항

### iOS
- Info.plist에 카메라, 위치 권한 설명 추가
- 각 소셜 로그인 URL Scheme 설정
- ATS(App Transport Security) 설정

### Android
- AndroidManifest.xml 권한 선언
- 각 소셜 로그인 패키지명 등록
- ProGuard 규칙 (릴리즈 빌드)

### Web
- CORS 설정 확인
- 브라우저 로컬 스토리지 제한 고려
- 일부 소셜 로그인 제약 (팀즈 등)

## 9. 예시 프롬프트

### 기능 추가
```
목표: 자산 인증 상세 화면에 서명 공유 버튼을 추가한다.
범위: lib/view/asset_verification/detail_page.dart, 
      lib/widgets/verification_action_section.dart
제약: Material 3 스타일, 모바일/데스크톱 반응형 유지
      Share API 또는 flutter_share 패키지 사용
테스트: flutter analyze, flutter test, 
       수동 테스트 (Android, iOS, Web)
산출물: 코드 변경 및 스크린샷
```

### 버그 수정
```
목표: 토큰 갱신 시 무한 루프 발생하는 버그 수정
범위: lib/services/auth_service.dart
제약: 기존 API 시그니처 유지, 로그 추가
테스트: flutter test test/services/auth_service_test.dart
       시나리오: 토큰 만료 → 갱신 실패 → 로그아웃
산출물: 버그 수정 코드 + 테스트 케이스
```

### 리팩토링
```
목표: AssetsListPage의 필터 로직을 별도 클래스로 분리
범위: lib/view/assets/list_page.dart
      새 파일: lib/services/asset_filter_service.dart
제약: 기존 UI 동작 변경 없음, 테스트 커버리지 유지
테스트: flutter test
산출물: 리팩토링된 코드 + 유닛 테스트
```

## 10. 디버깅 가이드

### 일반적인 문제

**인증 실패**
- 각 플랫폼 앱 등록 확인
- API 키 및 Redirect URI 확인
- 네트워크 로그 확인

**동기화 오류**
- 로컬 DB 상태 확인 (`synced` 플래그)
- API 응답 로그 확인
- 오프라인 큐 상태 확인

**UI 렌더링 문제**
- 위젯 트리 오버플로우 확인
- 반응형 조건문 검증
- DevTools로 위젯 구조 분석

### 로그 확인
```dart
if (kDebugMode) {
  debugPrint('API 요청: $url');
  debugPrint('응답: $response');
}
```

### 프로파일링
```bash
# 성능 프로파일
flutter run --profile

# 메모리 프로파일
flutter run --profile --trace-skia
```

## 11. 배포 체크리스트

### 릴리즈 전
- [ ] 모든 테스트 통과
- [ ] 코드 리뷰 완료
- [ ] 변경 사항 문서화
- [ ] 버전 번호 업데이트
- [ ] 각 플랫폼별 빌드 확인
- [ ] 소셜 로그인 프로덕션 설정 확인
- [ ] API 엔드포인트 프로덕션으로 변경
- [ ] 디버그 로그 제거

### 배포 후
- [ ] 크래시 리포트 모니터링
- [ ] 사용자 피드백 수집
- [ ] 성능 메트릭 확인
- [ ] 서버 로그 모니터링

이 가이드라인을 기반으로 AI가 코드를 생성하면, 일관성 있고 유지보수 가능한 코드베이스를 유지할 수 있습니다.
