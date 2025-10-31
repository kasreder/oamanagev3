import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

ThemeData buildTheme() {
  final base = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2454FF)),
    textTheme: GoogleFonts.pretendardTextTheme(),
  );

  return base.copyWith(
    appBarTheme: base.appBarTheme.copyWith(centerTitle: true),
    navigationBarTheme: base.navigationBarTheme.copyWith(
      indicatorColor: base.colorScheme.primaryContainer,
      labelTextStyle: MaterialStateProperty.all(
        base.textTheme.labelMedium?.copyWith(fontWeight: FontWeight.w600),
      ),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    ),
  );
}
