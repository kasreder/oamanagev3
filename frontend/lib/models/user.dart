class DepartmentInfo {
  const DepartmentInfo({
    this.hq,
    this.dept,
    this.team,
    this.part,
  });

  factory DepartmentInfo.fromJson(Map<String, dynamic> json) => DepartmentInfo(
        hq: json['hq'] as String?,
        dept: json['dept'] as String?,
        team: json['team'] as String?,
        part: json['part'] as String?,
      );

  final String? hq;
  final String? dept;
  final String? team;
  final String? part;

  Map<String, dynamic> toJson() => {
        'hq': hq,
        'dept': dept,
        'team': team,
        'part': part,
      }..removeWhere((key, value) => value == null);
}

class User {
  const User({
    required this.id,
    required this.employeeId,
    required this.name,
    this.email,
    this.phone,
    this.provider,
    this.providerId,
    this.department,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
        id: json['id'] as int,
        employeeId: json['employeeId'] as String,
        name: json['name'] as String,
        email: json['email'] as String?,
        phone: json['phone'] as String?,
        provider: json['provider'] as String?,
        providerId: json['providerId'] as String?,
        department:
            json['department'] != null ? DepartmentInfo.fromJson(json['department'] as Map<String, dynamic>) : null,
      );

  final int id;
  final String employeeId;
  final String name;
  final String? email;
  final String? phone;
  final String? provider;
  final String? providerId;
  final DepartmentInfo? department;

  Map<String, dynamic> toJson() => {
        'id': id,
        'employeeId': employeeId,
        'name': name,
        'email': email,
        'phone': phone,
        'provider': provider,
        'providerId': providerId,
        'department': department?.toJson(),
      }..removeWhere((key, value) => value == null);
}
