import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class HUXGreetingWidget extends StatelessWidget {
  final String userName;
  const HUXGreetingWidget({Key? key, required this.userName}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        width: 500,
        height: 350,
        decoration: BoxDecoration(
          color: Colors.black,
          borderRadius: BorderRadius.circular(40),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.5),
              blurRadius: 30,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Stack(
          children: [
            // Heart background
            Center(
              child: CustomPaint(
                size: const Size(400, 320),
                painter: _HeartBackgroundPainter(),
              ),
            ),
            // Greeting text
            Positioned(
              left: 50,
              bottom: 60,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Hi, $userName!',
                    style: GoogleFonts.poppins(
                      fontSize: 44,
                      color: Colors.white,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'How Are You\nToday?',
                    style: GoogleFonts.poppins(
                      fontSize: 36,
                      color: Colors.grey.shade400,
                      fontWeight: FontWeight.w300,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _HeartBackgroundPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final List<Color> colors = [
      const Color(0xFF1B1B2F).withOpacity(0.7),
      const Color(0xFF1976D2).withOpacity(0.5),
      const Color(0xFF00B4D8).withOpacity(0.4),
      const Color(0xFFB5179E).withOpacity(0.7),
    ];
    final List<double> scales = [1.0, 0.7, 0.45];
    for (int i = 0; i < scales.length; i++) {
      _drawHeart(
        canvas,
        size,
        scale: scales[i],
        color: colors[i],
      );
    }
    // Center heart
    _drawHeart(canvas, size, scale: 0.22, color: colors[3]);
  }

  void _drawHeart(Canvas canvas, Size size, {required double scale, required Color color}) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;
    final path = Path();
    final w = size.width * scale;
    final h = size.height * scale;
    final x = (size.width - w) / 2;
    final y = (size.height - h) / 2;
    path.moveTo(x + w / 2, y + h * 0.75);
    path.cubicTo(
      x + w * 1.2, y + h * 0.45, // right control
      x + w * 0.8, y - h * 0.15, // right top
      x + w / 2, y + h * 0.25,   // top center
    );
    path.cubicTo(
      x + w * 0.2, y - h * 0.15, // left top
      x - w * 0.2, y + h * 0.45, // left control
      x + w / 2, y + h * 0.75,   // back to start
    );
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
} 