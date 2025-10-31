abstract class SignatureStorage {
  Future<void> saveSignature(String assetUid, List<int> bytes);
  Future<List<int>?> readSignature(String assetUid);
}

class MemorySignatureStorage implements SignatureStorage {
  final Map<String, List<int>> _storage = {};

  @override
  Future<void> saveSignature(String assetUid, List<int> bytes) async {
    _storage[assetUid] = bytes;
  }

  @override
  Future<List<int>?> readSignature(String assetUid) async {
    return _storage[assetUid];
  }
}
