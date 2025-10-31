import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../providers/auth_provider.dart';
import '../view/home/home_page.dart';
import '../view/login/login_page.dart';

GoRouter createRouter(AuthProvider auth) {
  return GoRouter(
    initialLocation: '/login',
    refreshListenable: auth,
    redirect: (context, state) {
      final isLoggedIn = auth.isAuthenticated;
      final isGuest = auth.isGuest;
      final isOnLogin = state.uri.path == '/login';

      if (!isLoggedIn && !isGuest && !isOnLogin) {
        return '/login';
      }
      if (isLoggedIn && isOnLogin) {
        return '/home';
      }
      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        name: 'login',
        pageBuilder: (context, state) => const MaterialPage(child: LoginPage()),
      ),
      GoRoute(
        path: '/home',
        name: 'home',
        pageBuilder: (context, state) => const MaterialPage(child: HomePage()),
      ),
    ],
  );
}
