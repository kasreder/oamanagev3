import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../providers/auth_provider.dart';
import '../../providers/inspection_provider.dart';
import '../common/app_scaffold.dart';
import '../verification/verification_list_section.dart';
import '../assets/asset_list_section.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  void initState() {
    super.initState();
    final auth = context.read<AuthProvider>();
    final inspection = context.read<InspectionProvider>();
    inspection.bindTokenProvider(() => auth.accessToken);
    inspection.loadDashboard();
  }

  @override
  Widget build(BuildContext context) {
    final inspection = context.watch<InspectionProvider>();
    final isLoading = inspection.isLoading;

    return AppScaffold(
      selectedIndex: 0,
      body: RefreshIndicator(
        onRefresh: () => inspection.loadDashboard(),
        child: ListView(
          padding: const EdgeInsets.all(24),
          children: [
            Text(
              '오늘의 실사 현황',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 16),
            if (isLoading)
              const Center(child: CircularProgressIndicator())
            else ...[
              VerificationListSection(verifications: inspection.verifications),
              const SizedBox(height: 32),
              AssetListSection(assets: inspection.assets),
            ],
          ],
        ),
      ),
    );
  }
}
