import '../../models/asset.dart';
import '../../services/api_client.dart';

class AssetRepository {
  AssetRepository(this._client);

  final ApiClient _client;

  Future<List<Asset>> fetchAssets({String? query, String? status}) async {
    final response = await _client.dio.get<Map<String, dynamic>>(
      '/assets',
      queryParameters: {
        if (query != null && query.isNotEmpty) 'q': query,
        if (status != null && status.isNotEmpty) 'status': status,
      },
    );
    final items = response.data!['items'] as List<dynamic>;
    return items.cast<Map<String, dynamic>>().map(Asset.fromJson).toList();
  }
}
