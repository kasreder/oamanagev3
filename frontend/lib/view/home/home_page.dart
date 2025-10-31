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
    if (auth.isAuthenticated) {
      inspection.bindTokenProvider(() => auth.accessToken);
      inspection.loadDashboard();
    } else {
      inspection.showGuestPreview();
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final inspection = context.watch<InspectionProvider>();
    final isLoading = inspection.isLoading;

    return AppScaffold(
      selectedIndex: 0,
      body: RefreshIndicator(
        onRefresh: () => inspection.loadDashboard(),
        child: ListView(
          padding: const EdgeInsets.all(24),
          children: [
            if (auth.isGuest) ...[
              const _GuestModeBanner(),
              const SizedBox(height: 24),
            ],
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

class _GuestModeBanner extends StatelessWidget {
  const _GuestModeBanner();

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Theme.of(context).colorScheme.surfaceVariant,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text(
              '둘러보기 모드',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            SizedBox(height: 8),
            Text('실제 데이터를 확인하려면 로그인해주세요. 지금은 샘플 데이터를 보여드리고 있어요.'),
          ],
        ),
      ),
    );
  }
}
