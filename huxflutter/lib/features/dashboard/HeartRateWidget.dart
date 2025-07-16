import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class HeartRateWidget extends StatelessWidget {
  final int value;
  final List<List<double>> data; // Each list is a group of bar heights for a time slot
  final List<String> timeLabels;
  const HeartRateWidget({
    Key? key,
    this.value = 164,
    this.data = const [
      [0.3, 0.5], [0.2, 0.4, 0.6], [0.4, 0.7], [0.6, 0.8, 0.9], [0.5, 0.7], [0.3, 0.5],
      [0.2, 0.4, 0.6], [0.4, 0.7], [0.6, 0.8, 0.9], [0.5, 0.7], [0.3, 0.5], [0.2, 0.4, 0.6]
    ],
    this.timeLabels = const ['12am', '4am', '8am', '12pm', '4pm', '8pm'],
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 300,
      height: 180,
      decoration: BoxDecoration(
        color: const Color(0xFF101A2B),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Stack(
        children: [
          // Chart
          Positioned.fill(
            top: 40,
            bottom: 32,
            left: 16,
            right: 16,
            child: CustomPaint(
              painter: _HRVBarChartPainter(data: data),
            ),
          ),
          // Title
          Positioned(
            top: 18,
            left: 20,
            child: Text(
              'Heart Rate Variability',
              style: GoogleFonts.poppins(
                fontSize: 18,
                color: Colors.white.withOpacity(0.9),
                fontWeight: FontWeight.w400,
              ),
            ),
          ),
          // Value
          Positioned(
            top: 18,
            right: 20,
            child: RichText(
              text: TextSpan(
                children: [
                  TextSpan(
                    text: value.toString(),
                    style: GoogleFonts.poppins(
                      fontSize: 28,
                      color: Colors.white.withOpacity(0.9),
                      fontWeight: FontWeight.w300,
                    ),
                  ),
                  TextSpan(
                    text: ' ms',
                    style: GoogleFonts.poppins(
                      fontSize: 18,
                      color: Colors.grey.shade400,
                      fontWeight: FontWeight.w300,
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Time labels
          Positioned(
            left: 16,
            right: 16,
            bottom: 10,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: timeLabels.map((label) => Text(
                label,
                style: GoogleFonts.poppins(
                  fontSize: 13,
                  color: Colors.grey.shade400,
                  fontWeight: FontWeight.w300,
                ),
              )).toList(),
            ),
          ),
        ],
      ),
    );
  }
}

class _HRVBarChartPainter extends CustomPainter {
  final List<List<double>> data;
  _HRVBarChartPainter({required this.data});

  @override
  void paint(Canvas canvas, Size size) {
    final barWidth = 10.0;
    final barSpacing = (size.width - data.length * barWidth) / (data.length - 1);
    final maxBarHeight = size.height - 10;
    final colors = [
      const Color(0xFF2196F3),
      const Color(0xFF7C3AED),
      const Color(0xFF00B4D8),
    ];
    for (int i = 0; i < data.length; i++) {
      final group = data[i];
      for (int j = 0; j < group.length; j++) {
        final barHeight = group[j] * maxBarHeight;
        final x = i * (barWidth + barSpacing);
        final y = size.height - barHeight;
        final paint = Paint()
          ..shader = LinearGradient(
            colors: [
              colors[j % colors.length].withOpacity(0.7),
              colors[j % colors.length].withOpacity(0.4),
            ],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ).createShader(Rect.fromLTWH(x, y, barWidth, barHeight))
          ..style = PaintingStyle.fill;
        final rrect = RRect.fromRectAndRadius(
          Rect.fromLTWH(x, y, barWidth, barHeight),
          Radius.circular(barWidth / 2),
        );
        canvas.drawRRect(rrect, paint);
      }
    }
    // Optionally, draw vertical grid lines
    final gridPaint = Paint()
      ..color = Colors.white.withOpacity(0.08)
      ..strokeWidth = 1;
    for (int i = 0; i < 6; i++) {
      final x = i * size.width / 5;
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), gridPaint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
} 