import 'package:flutter/foundation.dart';

void setupLogger() {
  if (kDebugMode) {
    debugPrint('🔧 Logger initialized');
  }
}
