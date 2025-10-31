import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:oa_asset_manager/providers/auth_provider.dart';
import 'package:oa_asset_manager/providers/inspection_provider.dart';
import 'package:oa_asset_manager/view/home/home_page.dart';

void main() {
  testWidgets('홈 화면은 로딩 인디케이터를 표시한다', (tester) async {
    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => AuthProvider()),
          ChangeNotifierProvider(create: (_) => InspectionProvider()),
        ],
        child: const MaterialApp(home: HomePage()),
      ),
    );

    expect(find.byType(CircularProgressIndicator), findsOneWidget);
  });
}
