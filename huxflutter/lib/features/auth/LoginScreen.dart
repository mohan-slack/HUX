import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:glassmorphism/glassmorphism.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class LoginScreen extends StatefulWidget {
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _loading = false;

  Future<bool> login(String email, String password) async {
    setState(() { _loading = true; });
    await Future.delayed(Duration(seconds: 1)); // Simulate network
    setState(() { _loading = false; });
    return email == 'test@example.com' && password == 'password';
  }

  void _onLogin() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text;
    if (email.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please enter email and password')),
      );
      return;
    }
    bool success = await login(email, password);
    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Login successful!')),
      );
      // Navigate to home or dashboard
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Login failed. Check credentials.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return Scaffold(
      body: Stack(
        children: [
          // Background image
          Positioned.fill(
            child: Image.asset(
              'assets/images/login_bg.png',
              fit: BoxFit.cover,
            ),
          ),
          // Glassmorphic login form at the bottom
          Align(
            alignment: Alignment.bottomCenter,
            child: Padding(
              padding: EdgeInsets.only(bottom: size.height * 0.06, left: 24, right: 24),
              child: GlassmorphicContainer(
                width: double.infinity,
                height: 370,
                borderRadius: 32,
                blur: 20,
                alignment: Alignment.center,
                border: 2,
                linearGradient: LinearGradient(
                  colors: [
                    Colors.white.withOpacity(0.2),
                    Colors.white.withOpacity(0.05),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderGradient: LinearGradient(
                  colors: [
                    Colors.white.withOpacity(0.6),
                    Colors.white.withOpacity(0.1),
                  ],
                ),
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Email
                      _GlassTextField(
                        hint: "Email",
                        controller: _emailController,
                      ),
                      SizedBox(height: 16),
                      // Password
                      _GlassTextField(
                        hint: "Password",
                        obscure: true,
                        controller: _passwordController,
                      ),
                      SizedBox(height: 24),
                      // Login Button
                      _GlassButton(
                        text: _loading ? "Logging in..." : "Login",
                        onPressed: _loading ? null : _onLogin,
                      ),
                      SizedBox(height: 16),
                      // Forgot Password
                      GestureDetector(
                        onTap: () {
                          Navigator.pushNamed(context, '/forgot');
                        },
                        child: Text(
                          "Forgot password?",
                          style: GoogleFonts.poppins(
                            color: Colors.white.withOpacity(0.85),
                            fontSize: 16,
                            fontWeight: FontWeight.w400,
                          ),
                        ),
                      ),
                      SizedBox(height: 16),
                      // Sign up row
                      Flexible(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              "Don't have an account? ",
                              style: GoogleFonts.poppins(
                                color: Colors.white.withOpacity(0.85),
                                fontSize: 16,
                              ),
                            ),
                            GestureDetector(
                              onTap: () {
                                Navigator.pushNamed(context, '/signup');
                              },
                              child: Text(
                                "Sign up",
                                style: GoogleFonts.poppins(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                            SizedBox(width: 8),
                            GestureDetector(
                              onTap: () {
                                Navigator.pushNamed(context, '/signup');
                              },
                              child: Container(
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: Colors.white.withOpacity(0.2),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black26,
                                      blurRadius: 8,
                                      offset: Offset(2, 4),
                                    ),
                                  ],
                                ),
                                padding: EdgeInsets.all(8),
                                child: Icon(Icons.play_arrow_rounded, color: Colors.white, size: 28),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// Glassmorphic TextField
class _GlassTextField extends StatelessWidget {
  final String hint;
  final bool obscure;
  final TextEditingController controller;
  const _GlassTextField({required this.hint, this.obscure = false, required this.controller});
  @override
  Widget build(BuildContext context) {
    return GlassmorphicContainer(
      width: double.infinity,
      height: 56,
      borderRadius: 24,
      blur: 10,
      border: 1,
      linearGradient: LinearGradient(
        colors: [
          Colors.white.withOpacity(0.15),
          Colors.white.withOpacity(0.05),
        ],
      ),
      borderGradient: LinearGradient(
        colors: [
          Colors.white.withOpacity(0.4),
          Colors.white.withOpacity(0.1),
        ],
      ),
      child: TextField(
        controller: controller,
        obscureText: obscure,
        style: GoogleFonts.poppins(color: Colors.white, fontSize: 18),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: GoogleFonts.poppins(color: Colors.white70, fontSize: 18),
          border: InputBorder.none,
          contentPadding: EdgeInsets.symmetric(horizontal: 20),
        ),
      ),
    );
  }
}

// Glassmorphic Button
class _GlassButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  const _GlassButton({required this.text, required this.onPressed});
  @override
  Widget build(BuildContext context) {
    return GlassmorphicContainer(
      width: double.infinity,
      height: 60,
      borderRadius: 32,
      blur: 10,
      border: 1.5,
      linearGradient: LinearGradient(
        colors: [
          Colors.white.withOpacity(0.25),
          Colors.white.withOpacity(0.08),
        ],
      ),
      borderGradient: LinearGradient(
        colors: [
          Colors.white.withOpacity(0.5),
          Colors.white.withOpacity(0.1),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(32),
          onTap: onPressed,
          child: Center(
            child: Text(
              text,
              style: GoogleFonts.poppins(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 28,
                shadows: [
                  Shadow(
                    color: Colors.black26,
                    blurRadius: 8,
                    offset: Offset(2, 2),
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