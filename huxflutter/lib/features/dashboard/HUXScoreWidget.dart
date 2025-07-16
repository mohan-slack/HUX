import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class HUXScoreWidget extends StatefulWidget {
  final String userName;
  final String stressLevel;
  final int heartRateVariability;
  final double initialScore;
  const HUXScoreWidget({
    Key? key,
    required this.userName,
    required this.stressLevel,
    required this.heartRateVariability,
    this.initialScore = 82,
  }) : super(key: key);

  @override
  State<HUXScoreWidget> createState() => _HUXScoreWidgetState();
}

class _HUXScoreWidgetState extends State<HUXScoreWidget>
    with SingleTickerProviderStateMixin {
  late double _score;
  late AnimationController _controller;
  late Animation<double> _pulseAnim;
  late Animation<double> _rotationAnim;
  double _targetScore = 82;

  @override
  void initState() {
    super.initState();
    _score = widget.initialScore;
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
    _pulseAnim = Tween<double>(begin: 1.0, end: 1.08).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
    _rotationAnim = Tween<double>(begin: 0, end: 2 * pi).animate(
      CurvedAnimation(parent: _controller, curve: Curves.linear),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _updateScore(double value) {
    setState(() {
      _targetScore = value;
      _score = value;
    });
  }

  @override
  Widget build(BuildContext context) {
    final neonColor = Colors.cyanAccent.shade400;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 0),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF0F2027), Color(0xFF2C5364)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Greeting and Title
          Padding(
            padding: const EdgeInsets.only(bottom: 8.0, left: 24, right: 24),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Hi, ${widget.userName}!",
                        style: GoogleFonts.poppins(
                          fontSize: 24,
                          color: Colors.grey.shade300,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        "Your HUX Score",
                        style: GoogleFonts.orbitron(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                          height: 1.2,
                          letterSpacing: 1.2,
                        ),
                      ),
                    ],
                  ),
                ),
                // Optionally, add an icon or avatar here
              ],
            ),
          ),
          // Animated Neon Ring and Score + Details
          SizedBox(
            height: 240,
            child: Stack(
              alignment: Alignment.center,
              children: [
                // Neon Ring
                AnimatedBuilder(
                  animation: _controller,
                  builder: (context, child) {
                    return Center(
                      child: Transform.rotate(
                        angle: _rotationAnim.value,
                        child: CustomPaint(
                          painter: _NeonRingPainter(
                            glowColor: neonColor,
                            pulse: _pulseAnim.value,
                          ),
                          child: const SizedBox(
                            width: 180,
                            height: 180,
                          ),
                        ),
                      ),
                    );
                  },
                ),
                // Glowing Score
                AnimatedBuilder(
                  animation: _controller,
                  builder: (context, child) {
                    return Text(
                      _score.toInt().toString(),
                      style: GoogleFonts.orbitron(
                        fontSize: 64,
                        fontWeight: FontWeight.bold,
                        color: neonColor,
                        shadows: [
                          Shadow(
                            color: neonColor.withOpacity(0.8),
                            blurRadius: 24,
                          ),
                          Shadow(
                            color: Colors.white.withOpacity(0.5),
                            blurRadius: 8,
                          ),
                        ],
                      ),
                    );
                  },
                ),
                // Stress Level
                Positioned(
                  left: 0,
                  bottom: 20,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        vertical: 8, horizontal: 14),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.9),
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black12,
                          blurRadius: 6,
                          spreadRadius: 1,
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Stress Level",
                          style: TextStyle(
                              fontSize: 14,
                              color: Colors.black54,
                              fontWeight: FontWeight.w400),
                        ),
                        Text(
                          widget.stressLevel,
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                // Heart Rate Variability
                Positioned(
                  right: 0,
                  bottom: 50,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        vertical: 8, horizontal: 14),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.9),
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black12,
                          blurRadius: 6,
                          spreadRadius: 1,
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Heart Rate\nVariability",
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.black54,
                          ),
                        ),
                        Text(
                          "${widget.heartRateVariability} ms",
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Slider
          Padding(
            padding: const EdgeInsets.only(top: 24.0),
            child: SliderTheme(
              data: SliderTheme.of(context).copyWith(
                activeTrackColor: neonColor,
                inactiveTrackColor: neonColor.withOpacity(0.2),
                thumbColor: neonColor,
                overlayColor: neonColor.withOpacity(0.2),
                trackHeight: 4,
              ),
              child: Slider(
                min: 0,
                max: 100,
                value: _score,
                onChanged: (value) => setState(() => _score = value),
                onChangeEnd: _updateScore,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _NeonRingPainter extends CustomPainter {
  final Color glowColor;
  final double pulse;
  _NeonRingPainter({required this.glowColor, required this.pulse});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 * 0.85 * pulse;
    // Neon glow
    for (double glow = 16; glow > 0; glow -= 2) {
      final paint = Paint()
        ..color = glowColor.withOpacity(0.04 + 0.08 * (glow / 16))
        ..style = PaintingStyle.stroke
        ..strokeWidth = glow;
      canvas.drawCircle(center, radius, paint);
    }
    // Main ring
    final ringPaint = Paint()
      ..shader = SweepGradient(
        colors: [
          glowColor,
          Colors.blueAccent,
          glowColor,
          Colors.purpleAccent,
          glowColor,
        ],
        startAngle: 0,
        endAngle: 2 * pi,
      ).createShader(Rect.fromCircle(center: center, radius: radius))
      ..style = PaintingStyle.stroke
      ..strokeWidth = 10;
    canvas.drawCircle(center, radius, ringPaint);
    // Inner glass ring
    final glassPaint = Paint()
      ..color = Colors.white.withOpacity(0.08)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 24;
    canvas.drawCircle(center, radius - 12, glassPaint);
  }

  @override
  bool shouldRepaint(covariant _NeonRingPainter oldDelegate) {
    return oldDelegate.pulse != pulse || oldDelegate.glowColor != glowColor;
  }
} 