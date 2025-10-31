import 'package:flutter/material.dart';

import '../data/repositories/asset_repository.dart';
import '../data/repositories/verification_repository.dart';
import '../models/asset.dart';
import '../models/verification.dart';
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
}
