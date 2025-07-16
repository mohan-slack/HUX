import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ECGWidget extends StatelessWidget {
  final int bpm;
  final String rhythm;
  const ECGWidget({Key? key, this.bpm = 88, this.rhythm = 'Sinus Rhythm'}) : super(key: key);

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
          // Glowing heart
          Positioned(
            top: 24,
            right: 24,
            child: CustomPaint(
              size: const Size(48, 48),
              painter: _GlowingHeartPainter(),
            ),
          ),
          // Texts
          Padding(
            padding: const EdgeInsets.only(left: 20, top: 18, right: 80),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'ECG',
                  style: GoogleFonts.poppins(
                    fontSize: 20,
                    color: Colors.grey.shade400,
                    fontWeight: FontWeight.w400,
                  ),
                ),
                const SizedBox(height: 18),
                Text(
                  rhythm,
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    color: Colors.grey.shade400,
                    fontWeight: FontWeight.w400,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '$bpm BMP',
                  style: GoogleFonts.poppins(
                    fontSize: 32,
                    color: Colors.white.withOpacity(0.85),
                    fontWeight: FontWeight.w300,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _GlowingHeartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final glowPaint = Paint()
      ..color = const Color(0xFF2196F3).withOpacity(0.45)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 16);
    final heartPaint = Paint()
      ..color = const Color(0xFF2196F3)
      ..style = PaintingStyle.fill;
    final path = Path();
    final w = size.width;
    final h = size.height;
    path.moveTo(w / 2, h * 0.72);
    path.cubicTo(
      w * 1.1, h * 0.45,
      w * 0.8, h * 0.1,
      w / 2, h * 0.28,
    );
    path.cubicTo(
      w * 0.2, h * 0.1,
      -w * 0.1, h * 0.45,
      w / 2, h * 0.72,
    );
    // Draw glow
    canvas.drawPath(path, glowPaint);
    // Draw heart
    canvas.drawPath(path, heartPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
} 