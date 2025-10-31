import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../../providers/auth_provider.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    final providers = [
      _LoginProvider(name: '카카오', value: 'kakao', color: const Color(0xFFFEE500)),
      _LoginProvider(name: '네이버', value: 'naver', color: const Color(0xFF2DB400)),
      _LoginProvider(name: '구글', value: 'google', color: const Color(0xFFFFFFFF), textColor: Colors.black87),
      _LoginProvider(name: '팀즈', value: 'teams', color: const Color(0xFF464EB8)),
    ];

    return Scaffold(
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 420),
          child: Card(
            elevation: 4,
            margin: const EdgeInsets.all(24),
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'OA Asset Manager',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    '소셜 계정으로 로그인하고 자산 실사를 시작하세요.',
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  ...providers.map((item) => _SocialLoginButton(provider: item)).toList(),
                  const SizedBox(height: 16),
                  FilledButton.tonal(
                    onPressed: () async {
                      await context.read<AuthProvider>().enterAsGuest();
                      if (!context.mounted) {
                        return;
                      }
                      context.go('/home');
                    },
                    child: const Text('둘러보기'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _SocialLoginButton extends StatelessWidget {
  const _SocialLoginButton({required this.provider});

  final _LoginProvider provider;

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: FilledButton(
        style: FilledButton.styleFrom(
          backgroundColor: provider.color,
          foregroundColor: provider.textColor,
          minimumSize: const Size.fromHeight(48),
        ),
        onPressed: auth.isAuthenticated
            ? null
            : () async {
                await context.read<AuthProvider>().loginWithProvider(provider.value);
              },
        child: Text('${provider.name}로 계속하기'),
      ),
    );
  }
}

class _LoginProvider {
  const _LoginProvider({
    required this.name,
    required this.value,
    required this.color,
    this.textColor = Colors.white,
  });

  final String name;
  final String value;
  final Color color;
  final Color textColor;
}
