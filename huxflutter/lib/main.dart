import 'package:flutter/material.dart';
import 'features/auth/LoginScreen.dart';
import 'features/auth/SignupScreen.dart';
import 'features/auth/ForgotPasswordScreen.dart';
import 'features/dashboard/HUXGreetingWidget.dart';
import 'features/dashboard/ECGWidget.dart';
import 'features/dashboard/HeartRateWidget.dart';
import 'dart:math' as math;

void main() {
  runApp(MaterialApp(
    debugShowCheckedModeBanner: false,
    initialRoute: '/',
    routes: {
      '/': (context) => LoginScreen(),
      '/signup': (context) => SignupScreen(),
      '/forgot': (context) => ForgotPasswordScreen(),
      '/dashboard': (context) => DashboardPage(),
    },
  ));
}

class HuxApp extends StatelessWidget {
  const HuxApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'HUX Smart Ring',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blueAccent),
        useMaterial3: true,
      ),
      home: const LoginPage(),
    );
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  String _username = '';
  String _password = '';
  bool _loading = false;
  String? _error;

  void _login() {
    if (_formKey.currentState?.validate() ?? false) {
      setState(() {
        _loading = true;
        _error = null;
      });
      // Simulate login delay
      Future.delayed(const Duration(seconds: 1), () {
        setState(() {
          _loading = false;
        });
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const DashboardPage()),
        );
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(32),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.fingerprint, size: 64, color: Colors.blueAccent),
                const SizedBox(height: 16),
                Text('HUX Smart Ring', style: Theme.of(context).textTheme.headlineMedium),
                const SizedBox(height: 32),
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Username'),
                  onChanged: (v) => _username = v,
                  validator: (v) => v == null || v.isEmpty ? 'Enter username' : null,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  decoration: const InputDecoration(labelText: 'Password'),
                  obscureText: true,
                  onChanged: (v) => _password = v,
                  validator: (v) => v == null || v.isEmpty ? 'Enter password' : null,
                ),
                const SizedBox(height: 24),
                if (_error != null) ...[
                  Text(_error!, style: const TextStyle(color: Colors.red)),
                  const SizedBox(height: 8),
                ],
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _loading ? null : _login,
                    child: _loading
                        ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                        : const Text('Login'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> with SingleTickerProviderStateMixin {
  final PageController _pageController = PageController();
  int _currentPage = 0;
  late AnimationController _glowController;
  @override
  void initState() {
    super.initState();
    _glowController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    )..repeat(reverse: true);
    Future.delayed(const Duration(seconds: 2), _autoSwitch);
  }

  void _autoSwitch() {
    if (!mounted) return;
    setState(() {
      _currentPage = (_currentPage + 1) % 2;
    });
    _pageController.animateToPage(
      _currentPage,
      duration: const Duration(milliseconds: 600),
      curve: Curves.easeInOutCubic,
    ).then((_) {
      if (mounted) {
        Future.delayed(const Duration(seconds: 2), _autoSwitch);
      }
    });
  }

  @override
  void dispose() {
    _glowController.dispose();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final features = [
      _FeatureCardData('Sleep Tracking', Icons.bedtime, '7h 15m', 'Last night'),
      _FeatureCardData('Heart Rate', Icons.favorite, '72', 'bpm'),
      _FeatureCardData('Step Count', Icons.directions_walk, '8,500', 'Today'),
      _FeatureCardData('Body Temperature', Icons.thermostat, '36.7', '°C'),
    ];
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (_) => const LoginPage()),
                (route) => false,
              );
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          HUXGreetingWidget(
            userName: "Mohan",
          ),
          const SizedBox(height: 24),
          SizedBox(
            height: 200,
            child: Stack(
              alignment: Alignment.center,
              children: [
                AnimatedBuilder(
                  animation: Listenable.merge([_glowController, _pageController]),
                  builder: (context, child) {
                    double glowPage = _pageController.hasClients && _pageController.page != null
                        ? _pageController.page!.clamp(0, 1)
                        : _currentPage.toDouble();
                    // Glow intensity: max at center, min at edge
                    double glowIntensity = 0.25 + 0.25 * (1 - (glowPage - glowPage.round()).abs() * 2);
                    // Animate glow scale
                    double scale = 1.1 + 0.08 * math.sin(_glowController.value * 2 * math.pi);
                    // Animate glow position (slightly shift left/right)
                    double dx = 60 * (glowPage - 0.5);
                    Color glowColor = glowPage < 0.5
                        ? const Color(0xFF2196F3).withOpacity(glowIntensity)
                        : const Color(0xFF7C3AED).withOpacity(glowIntensity);
                    return Transform.translate(
                      offset: Offset(dx, 0),
                      child: Container(
                        width: 340 * scale,
                        height: 140 * scale,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(80),
                          boxShadow: [
                            BoxShadow(
                              color: glowColor,
                              blurRadius: 60,
                              spreadRadius: 8,
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
                PageView.builder(
                  controller: _pageController,
                  itemCount: 2,
                  itemBuilder: (context, index) {
                    return AnimatedBuilder(
                      animation: _pageController,
                      builder: (context, child) {
                        double page = 0;
                        if (_pageController.hasClients && _pageController.page != null) {
                          page = _pageController.page!;
                        } else {
                          page = _currentPage.toDouble();
                        }
                        double delta = (page - index).abs().clamp(0.0, 1.0);
                        double scale = 1 - 0.08 * delta;
                        double opacity = 1 - 0.5 * delta;
                        return Opacity(
                          opacity: opacity,
                          child: Transform.scale(
                            scale: scale,
                            child: child,
                          ),
                        );
                      },
                      child: index == 0
                          ? ECGWidget(
                              bpm: 88,
                              rhythm: 'Sinus Rhythm',
                            )
                          : HeartRateWidget(
                              value: 164,
                            ),
                    );
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          GridView.count(
            shrinkWrap: true,
            physics: NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            children: features.map((f) => _FeatureCard(data: f)).toList(),
          ),
        ],
      ),
    );
  }
}

class _FeatureCardData {
  final String title;
  final IconData icon;
  final String value;
  final String subtitle;
  _FeatureCardData(this.title, this.icon, this.value, this.subtitle);
}

class _FeatureCard extends StatelessWidget {
  final _FeatureCardData data;
  const _FeatureCard({required this.data});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () {},
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(data.icon, size: 40, color: Colors.blueAccent),
              const SizedBox(height: 16),
              Text(data.value, style: Theme.of(context).textTheme.headlineSmall),
              const SizedBox(height: 8),
              Text(data.title, style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 4),
              Text(data.subtitle, style: Theme.of(context).textTheme.bodySmall),
            ],
          ),
        ),
      ),
    );
  }
}
