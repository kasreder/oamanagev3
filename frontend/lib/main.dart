import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';

import 'config/theme.dart';
import 'providers/auth_provider.dart';
import 'providers/inspection_provider.dart';
import 'router/app_router.dart';
import 'utils/logger.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const OAAssetApp());
}

class OAAssetApp extends StatelessWidget {
  const OAAssetApp({super.key});

  @override
  Widget build(BuildContext context) {
    setupLogger();
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => InspectionProvider())
      ],
      child: Consumer<AuthProvider>(
        builder: (context, auth, _) {
          return MaterialApp.router(
            title: 'OA Asset Manager',
            theme: buildTheme(),
            debugShowCheckedModeBanner: false,
            routerConfig: createRouter(auth),
            locale: const Locale('ko'),
            supportedLocales: const [Locale('ko')],
            localizationsDelegates: const [
              GlobalMaterialLocalizations.delegate,  // ✅ Material 위젯용
              GlobalWidgetsLocalizations.delegate,   // ✅ 공통 위젯용
              GlobalCupertinoLocalizations.delegate, // ✅ iOS 스타일용
            ],
          );
        },
      ),
    );
  }
}
