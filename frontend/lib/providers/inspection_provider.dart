import 'package:flutter/material.dart';

import '../data/repositories/asset_repository.dart';
import '../data/repositories/verification_repository.dart';
import '../models/asset.dart';
import '../models/verification.dart';
import '../models/user.dart';
import '../services/api_client.dart';

class InspectionProvider extends ChangeNotifier {
  InspectionProvider();

  String? Function()? _tokenProvider;
  AssetRepository? _assetRepository;
  VerificationRepository? _verificationRepository;

  List<Asset> _assets = const [];
  List<VerificationSummary> _verifications = const [];
  bool _isLoading = false;

  bool get isLoading => _isLoading;
  List<Asset> get assets => _assets;
  List<VerificationSummary> get verifications => _verifications;

  void bindTokenProvider(String? Function() provider) {
    _tokenProvider = provider;
    final apiClient = ApiClient(tokenProvider: () => _tokenProvider?.call());
    _assetRepository = AssetRepository(apiClient);
    _verificationRepository = VerificationRepository(apiClient);
  }

  Future<void> loadDashboard() async {
    if (_assetRepository == null || _verificationRepository == null) {
      return;
    }

    _isLoading = true;
    notifyListeners();

    try {
      _assets = await _assetRepository!.fetchAssets();
      _verifications = await _verificationRepository!.fetchSummaries();
    } on Exception catch (error) {
      debugPrint('데이터 로딩 실패: $error');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void showGuestPreview() {
    _isLoading = false;
    _assets = [
      Asset(
        uid: 'OA-2024-001',
        name: '맥북 프로 14"',
        assetType: '노트북',
        status: '사용 중',
        location: '서울 본사',
        owner: const User(id: 1, employeeId: 'EMP-001', name: '김보라'),
      ),
      Asset(
        uid: 'OA-2024-017',
        name: '델 울트라샤프 27',
        assetType: '모니터',
        status: '설치 완료',
        location: '서울 본사',
        owner: const User(id: 2, employeeId: 'EMP-014', name: '이준호'),
      ),
      Asset(
        uid: 'OA-2024-031',
        name: '로지텍 MX Master 3S',
        assetType: '주변기기',
        status: '배송 중',
        location: '부산 센터',
        owner: const User(id: 3, employeeId: 'EMP-029', name: '최서연'),
      ),
    ];

    _verifications = [
      VerificationSummary(
        assetUid: 'OA-2024-001',
        assetType: '노트북',
        barcodePhoto: true,
        signature: true,
        latestInspection: InspectionInfo(
          scannedAt: DateTime.now().subtract(const Duration(days: 2)),
          status: '완료',
        ),
      ),
      VerificationSummary(
        assetUid: 'OA-2024-017',
        assetType: '모니터',
        barcodePhoto: false,
        signature: true,
        latestInspection: InspectionInfo(
          scannedAt: DateTime.now().subtract(const Duration(days: 5)),
          status: '보완 필요',
        ),
      ),
      VerificationSummary(
        assetUid: 'OA-2024-031',
        assetType: '주변기기',
        barcodePhoto: false,
        signature: false,
      ),
    ];

    notifyListeners();
  }
}
