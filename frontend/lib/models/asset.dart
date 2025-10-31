import 'user.dart';

class AssetMetadata {
  const AssetMetadata({
    this.os,
    this.osVersion,
    this.network,
    this.memo,
    this.memo2,
  });

  factory AssetMetadata.fromJson(Map<String, dynamic> json) => AssetMetadata(
        os: json['os'] as String?,
        osVersion: json['os_ver'] as String?,
        network: json['network'] as String?,
        memo: json['memo'] as String?,
        memo2: json['memo2'] as String?,
      );

  final String? os;
  final String? osVersion;
  final String? network;
  final String? memo;
  final String? memo2;

  Map<String, dynamic> toJson() => {
        'os': os,
        'os_ver': osVersion,
        'network': network,
        'memo': memo,
        'memo2': memo2,
      }..removeWhere((key, value) => value == null);
}

class Asset {
  const Asset({
    required this.uid,
    this.name,
    this.assetType,
    this.modelName,
    this.serialNumber,
    this.status,
    this.location,
    this.organization,
    this.owner,
    this.metadata,
    this.barcodePhotoUrl,
  });

  factory Asset.fromJson(Map<String, dynamic> json) => Asset(
        uid: json['uid'] as String,
        name: json['name'] as String?,
        assetType: json['assetType'] as String?,
        modelName: json['modelName'] as String?,
        serialNumber: json['serialNumber'] as String?,
        status: json['status'] as String?,
        location: json['location'] as String?,
        organization: json['organization'] as String?,
        owner: json['owner'] != null
            ? User.fromJson({
                'id': (json['owner'] as Map<String, dynamic>)['id'],
                'employeeId': '',
                'name': (json['owner'] as Map<String, dynamic>)['name'],
              })
            : null,
        metadata: json['metadata'] != null ? AssetMetadata.fromJson(json['metadata'] as Map<String, dynamic>) : null,
        barcodePhotoUrl: json['barcodePhotoUrl'] as String?,
      );

  final String uid;
  final String? name;
  final String? assetType;
  final String? modelName;
  final String? serialNumber;
  final String? status;
  final String? location;
  final String? organization;
  final User? owner;
  final AssetMetadata? metadata;
  final String? barcodePhotoUrl;
}
