import 'package:flutter/material.dart';
import 'dart:math' as math;
import 'package:flutter/foundation.dart' show kIsWeb;

// Heart Rate Widget with 3D heart for web, static for mobile
class HeartRateWidget extends StatelessWidget {
  final String userName;
  final String stressLevel;
  final int heartRateVariability;

  const HeartRateWidget({
    Key? key,
    required this.userName,
    required this.stressLevel,
    required this.heartRateVariability,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Left Text
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Hi, $userName!",
                  style: const TextStyle(
                    fontSize: 28,
                    color: Colors.grey,
                    fontWeight: FontWeight.w400,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  "Let's measure\nyour heart rate",
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                    height: 1.2,
                  ),
                ),
              ],
            ),
          ),
          // Heart + Details
          SizedBox(
            width: 220,
            height: 220,
            child: Stack(
              alignment: Alignment.center,
              children: [
                if (kIsWeb)
                  RotatingHeart3D()
                else
                  Icon(Icons.favorite, color: Colors.redAccent, size: 120),
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
                          stressLevel,
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
                          "$heartRateVariability ms",
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
        ],
      ),
    );
  }
}

// --- Rotating Heart 3D for Web ---
class RotatingHeart3D extends StatefulWidget {
  const RotatingHeart3D({Key? key}) : super(key: key);

  @override
  _RotatingHeart3DState createState() => _RotatingHeart3DState();
}

class _RotatingHeart3DState extends State<RotatingHeart3D>
    with SingleTickerProviderStateMixin {
  // Placeholder for 3D logic. In a real web app, you would use three_dart and register the viewType.
  @override
  Widget build(BuildContext context) {
    // For now, just show a placeholder for web
    return Icon(Icons.favorite, color: Colors.red, size: 120);
  }
} 