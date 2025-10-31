import '../../models/verification.dart';
import '../../services/api_client.dart';

class VerificationRepository {
  VerificationRepository(this._client);

  final ApiClient _client;

  Future<List<VerificationSummary>> fetchSummaries() async {
    final response = await _client.dio.get<Map<String, dynamic>>('/verifications');
    final items = response.data!['items'] as List<dynamic>;
    return items.cast<Map<String, dynamic>>().map(VerificationSummary.fromJson).toList();
  }
}
