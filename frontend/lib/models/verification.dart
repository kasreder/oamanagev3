import 'asset.dart';
import 'user.dart';

class VerificationSummary {
  const VerificationSummary({
    required this.assetUid,
    this.team,
    this.user,
    this.assetType,
    this.barcodePhoto = false,
    this.signature = false,
    this.latestInspection,
  });

  factory VerificationSummary.fromJson(Map<String, dynamic> json) => VerificationSummary(
        assetUid: json['assetUid'] as String,
        team: json['team'] as String?,
        user: json['user'] != null
            ? User.fromJson({
                'id': (json['user'] as Map<String, dynamic>)['id'],
                'employeeId': '',
                'name': (json['user'] as Map<String, dynamic>)['name'],
              })
            : null,
        assetType: json['assetType'] as String?,
        barcodePhoto: json['barcodePhoto'] as bool? ?? false,
        signature: json['signature'] as bool? ?? false,
        latestInspection: json['latestInspection'] != null
            ? InspectionInfo.fromJson(json['latestInspection'] as Map<String, dynamic>)
            : null,
      );

  final String assetUid;
  final String? team;
  final User? user;
  final String? assetType;
  final bool barcodePhoto;
  final bool signature;
  final InspectionInfo? latestInspection;
}

class InspectionInfo {
  const InspectionInfo({
    required this.scannedAt,
    required this.status,
  });

  factory InspectionInfo.fromJson(Map<String, dynamic> json) => InspectionInfo(
        scannedAt: DateTime.parse(json['scannedAt'] as String),
        status: json['status'] as String,
      );

  final DateTime scannedAt;
  final String status;
}

class SignatureMeta {
  const SignatureMeta({
    required this.id,
    required this.storageLocation,
  });

  factory SignatureMeta.fromJson(Map<String, dynamic> json) => SignatureMeta(
        id: json['id'] as int,
        storageLocation: json['storageLocation'] as String,
      );

  final int id;
  final String storageLocation;
}

class VerificationDetail {
  const VerificationDetail({
    required this.summary,
    this.asset,
    this.signatureMeta,
  });

  factory VerificationDetail.fromJson(Map<String, dynamic> json) => VerificationDetail(
        summary: VerificationSummary.fromJson(json),
        asset: json['asset'] != null ? Asset.fromJson(json['asset'] as Map<String, dynamic>) : null,
        signatureMeta:
            json['signatureMeta'] != null ? SignatureMeta.fromJson(json['signatureMeta'] as Map<String, dynamic>) : null,
      );

  final VerificationSummary summary;
  final Asset? asset;
  final SignatureMeta? signatureMeta;
}
