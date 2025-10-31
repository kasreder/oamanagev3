import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../data/repositories/auth_repository.dart';
import '../models/user.dart';
import '../services/api_client.dart';

class AuthProvider extends ChangeNotifier {
  AuthProvider() : _secureStorage = const FlutterSecureStorage() {
    _repository = AuthRepository(ApiClient(tokenProvider: () => _accessToken));
  }

  final FlutterSecureStorage _secureStorage;
  late final AuthRepository _repository;

  String? _accessToken;
  String? _refreshToken;
  User? _user;

  String? get accessToken => _accessToken;
  User? get user => _user;
  bool get isAuthenticated => _accessToken != null && _user != null;

  Future<void> loginWithProvider(String provider) async {
    final (accessToken, refreshToken, user) = await _repository.loginWithSocial(
      provider: provider,
      accessToken: 'demo-token',
    );

    _accessToken = accessToken;
    _refreshToken = refreshToken;
    _user = user;

    await _secureStorage.write(key: 'accessToken', value: _accessToken);
    await _secureStorage.write(key: 'refreshToken', value: _refreshToken);

    notifyListeners();
  }

  Future<void> logout() async {
    _accessToken = null;
    _refreshToken = null;
    _user = null;

    await _secureStorage.delete(key: 'accessToken');
    await _secureStorage.delete(key: 'refreshToken');

    notifyListeners();
  }
}
