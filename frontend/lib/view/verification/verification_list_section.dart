import 'package:flutter/material.dart';

import '../../models/verification.dart';
import '../../utils/date_formatter.dart';

class VerificationListSection extends StatelessWidget {
  const VerificationListSection({super.key, required this.verifications});

  final List<VerificationSummary> verifications;

  @override
  Widget build(BuildContext context) {
    if (verifications.isEmpty) {
      return const _EmptyState(message: '인증이 필요한 자산이 없습니다.');
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('인증 요약', style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 12),
        ...verifications.map((summary) => _VerificationTile(summary: summary)).toList(),
      ],
    );
  }
}

class _VerificationTile extends StatelessWidget {
  const _VerificationTile({required this.summary});

  final VerificationSummary summary;

  @override
  Widget build(BuildContext context) {
    final statusChips = [
      Chip(
        label: Text(summary.barcodePhoto ? '바코드 완료' : '바코드 필요'),
        backgroundColor: summary.barcodePhoto ? Colors.green.shade100 : Colors.orange.shade100,
      ),
      Chip(
        label: Text(summary.signature ? '서명 완료' : '서명 필요'),
        backgroundColor: summary.signature ? Colors.green.shade100 : Colors.orange.shade100,
      ),
    ];

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: CircleAvatar(child: Text(summary.assetType?.substring(0, 1) ?? '?')),
        title: Text(summary.assetUid),
        subtitle: Text(
          summary.latestInspection != null
              ? '최근 실사: ${DateFormatter.format(summary.latestInspection!.scannedAt)}'
              : '실사 내역 없음',
        ),
        trailing: Wrap(spacing: 8, children: statusChips),
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceVariant,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Text(message, textAlign: TextAlign.center),
    );
  }
}
