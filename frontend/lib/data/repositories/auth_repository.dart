import '../../models/user.dart';
import '../../services/api_client.dart';

class AuthRepository {
  AuthRepository(this._client);

  final ApiClient _client;

  Future<(String accessToken, String refreshToken, User user)> loginWithSocial({
    required String provider,
    required String accessToken,
  }) async {
    final response = await _client.dio.post<Map<String, dynamic>>(
      '/auth/social/$provider',
      data: {'accessToken': accessToken, 'provider': provider},
    );
    final data = response.data!;
    return (data['access_token'] as String, data['refresh_token'] as String, User.fromJson(data['user'] as Map<String, dynamic>));
  }

  Future<String> refresh(String refreshToken) async {
    final response = await _client.dio.post<Map<String, dynamic>>(
      '/auth/refresh',
      data: {'refresh_token': refreshToken},
    );
    return response.data!['access_token'] as String;
  }
}
