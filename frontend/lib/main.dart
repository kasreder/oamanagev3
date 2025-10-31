import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
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
              DefaultMaterialLocalizations.delegate,
              DefaultWidgetsLocalizations.delegate,
              DefaultCupertinoLocalizations.delegate,
            ],
          );
        },
      ),
    );
  }
}
