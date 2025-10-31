import 'package:intl/intl.dart';

class DateFormatter {
  static final _dateFormat = DateFormat('yyyy-MM-dd HH:mm');

  static String format(DateTime value) => _dateFormat.format(value.toLocal());
}
