import 'package:flutter/material.dart';
import 'features/auth/LoginScreen.dart';
import 'features/auth/SignupScreen.dart';
import 'features/auth/ForgotPasswordScreen.dart';

void main() {
  runApp(MaterialApp(
    debugShowCheckedModeBanner: false,
    initialRoute: '/',
    routes: {
      '/': (context) => LoginScreen(),
      '/signup': (context) => SignupScreen(),
      '/forgot': (context) => ForgotPasswordScreen(),
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

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    final features = [
      _FeatureCardData('Overall Score', Icons.emoji_events, '82', 'Good'),
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
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: GridView.count(
          crossAxisCount: 2,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          children: features.map((f) => _FeatureCard(data: f)).toList(),
        ),
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
