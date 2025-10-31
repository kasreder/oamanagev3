import 'package:flutter/material.dart';

import '../../models/asset.dart';

class AssetListSection extends StatelessWidget {
  const AssetListSection({super.key, required this.assets});

  final List<Asset> assets;

  @override
  Widget build(BuildContext context) {
    if (assets.isEmpty) {
      return const _EmptyState(message: '등록된 자산이 없습니다.');
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('최근 자산', style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 12),
        Wrap(
          spacing: 16,
          runSpacing: 16,
          children: assets
              .map(
                (asset) => SizedBox(
                  width: 280,
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(asset.uid, style: Theme.of(context).textTheme.titleMedium),
                          const SizedBox(height: 8),
                          Text(asset.assetType ?? '자산 유형 미정'),
                          const SizedBox(height: 8),
                          Text(asset.owner?.name ?? '소유자 정보 없음'),
                        ],
                      ),
                    ),
                  ),
                ),
              )
              .toList(),
        ),
      ],
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
