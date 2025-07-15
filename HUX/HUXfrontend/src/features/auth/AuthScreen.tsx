import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform, Animated, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as AppleAuthentication from 'expo-apple-authentication';

const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

WebBrowser.maybeCompleteAuthSession();

// Add your Google OAuth client IDs here
const GOOGLE_EXPO_CLIENT_ID = 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_IOS_CLIENT_ID = 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_ANDROID_CLIENT_ID = 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_WEB_CLIENT_ID = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';

const [request, response, promptAsync] = Google.useAuthRequest({
  expoClientId: GOOGLE_EXPO_CLIENT_ID,
  iosClientId: GOOGLE_IOS_CLIENT_ID,
  androidClientId: GOOGLE_ANDROID_CLIENT_ID,
  webClientId: GOOGLE_WEB_CLIENT_ID,
});

useEffect(() => {
  if (response?.type === 'success') {
    const { id_token } = response.params;
    // Send id_token to backend
    fetch(`${API_BASE_URL}/api/users/social-login/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: id_token }),
    })
      .then(res => res.json())
      .then(async data => {
        if (data.token) {
          await AsyncStorage.setItem('token', data.token);
          const pushToken = await registerForPushNotificationsAsync();
          if (pushToken) {
            await registerPushTokenWithBackend(pushToken, data.token);
          }
          navigation.replace('Main');
        } else {
          setError(data.error || 'Google login failed');
        }
      })
      .catch(() => setError('Google login failed'));
  }
}, [response]);

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return null;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    return null;
  }
  return token;
}

async function registerPushTokenWithBackend(token: string, jwt: string) {
  try {
    await fetch(`${API_BASE_URL}/api/users/register-push-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ pushToken: token }),
    });
  } catch (e) {
    // Ignore push registration errors for now
  }
}

async function handleAppleLogin() {
  try {
    const appleAuth = await AppleAuthentication.signInAsync({
      requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
    });
    if (!appleAuth.identityToken) {
      setError('Apple login failed: No identity token');
      return;
    }
    // Send idToken to backend
    const res = await fetch(`${API_BASE_URL}/api/users/social-login/apple`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: appleAuth.identityToken }),
    });
    const data = await res.json();
    if (data.token) {
      await AsyncStorage.setItem('token', data.token);
      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken) {
        await registerPushTokenWithBackend(pushToken, data.token);
      }
      navigation.replace('Main');
    } else {
      setError(data.error || 'Apple login failed');
    }
  } catch (err: any) {
    if (err.code === 'ERR_CANCELED') return;
    setError('Apple login failed');
  }
}

export default function AuthScreen() {
  const navigation = useNavigation();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetStep, setResetStep] = useState<'request' | 'reset'>('request');
  // Email verification state
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Auto-navigate to Main if token exists
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        navigation.replace('Main');
      }
    };
    checkToken();
  }, []);

  const handleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint = mode === 'login' ? '/api/users/login' : '/api/users/register';
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }
      if (mode === 'login' && data.token) {
        await AsyncStorage.setItem('token', data.token);
        // Fetch /me to check emailVerified
        const meRes = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${data.token}` },
        });
        const meData = await meRes.json();
        if (meData.user && meData.user.emailVerified) {
          const pushToken = await registerForPushNotificationsAsync();
          if (pushToken) {
            await registerPushTokenWithBackend(pushToken, data.token);
          }
          Alert.alert('Welcome to HUX!', 'Login successful!');
          navigation.replace('Main');
        } else {
          setShowVerifyModal(true);
        }
      } else if (mode === 'register') {
        setVerifyMessage('Registration successful! Please check your email to verify your account before logging in.');
        setMode('login');
      }
      setLoading(false);
    } catch (err) {
      setError('Network error');
      setLoading(false);
    }
  };

  const handlePasswordResetRequest = async () => {
    setResetMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/reset-password-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setResetMessage(data.error || 'Something went wrong');
        return;
      }
      setResetMessage(data.message);
      setResetStep('reset');
    } catch (err) {
      setResetMessage('Network error');
    }
  };

  const handlePasswordReset = async () => {
    setResetMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword: resetNewPassword }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setResetMessage(data.error || 'Something went wrong');
        return;
      }
      setResetMessage(data.message);
      setResetStep('request');
      setResetEmail('');
      setResetToken('');
      setResetNewPassword('');
    } catch (err) {
      setResetMessage('Network error');
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setVerifyMessage('');
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/users/verify-email-request`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setVerifyMessage(data.error || 'Failed to resend verification email');
      } else {
        setVerifyMessage('Verification email sent! Please check your inbox.');
      }
    } catch (err) {
      setVerifyMessage('Network error');
    }
    setResendLoading(false);
  };

  const handleCheckVerified = async () => {
    setVerifyMessage('');
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.user && data.user.emailVerified) {
        setShowVerifyModal(false);
        Alert.alert('Email verified!', 'You can now use the app.');
        navigation.replace('Main');
      } else {
        setVerifyMessage('Email not verified yet. Please check your inbox.');
      }
    } catch (err) {
      setVerifyMessage('Network error');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.gradientBg} />
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Image source={require('../../../assets/logos/hux-logo.png')} style={styles.logo} />
        <Text style={styles.brand}>HUX</Text>
        <Text style={styles.header}>{mode === 'login' ? 'Login' : 'Register'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
          </TouchableOpacity>
        </View>
        <View style={styles.rowBetween}>
          <TouchableOpacity style={styles.rememberMe} onPress={() => setRememberMe((v) => !v)}>
            <Ionicons name={rememberMe ? 'checkbox' : 'square-outline'} size={20} color="#2a2a72" />
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setResetModalVisible(true)}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{mode === 'login' ? 'Login' : 'Register'}</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
          <Text style={styles.switchText}>
            {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
        <View style={styles.socialContainer}>
          <Text style={styles.socialText}>Or continue with</Text>
          <View style={styles.socialRow}>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#fff', borderColor: '#4285F4' }]} onPress={() => promptAsync()}>
              <Ionicons name="logo-google" size={22} color="#4285F4" />
              <Text style={styles.socialButtonText}>Sign in with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: '#fff', borderColor: '#000' }]}
              onPress={handleAppleLogin}
              disabled={Platform.OS !== 'ios'}
            >
              <Ionicons name="logo-apple" size={22} color="#000" />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>
        </View>
        {__DEV__ && (
          <>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: '#e0e0e0', borderColor: '#1976D2' }]}
              onPress={async () => {
                setLoading(true);
                setError('');
                const res = await fetch(`${API_BASE_URL}/api/users/social-login/google`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ idToken: 'TEST_GOOGLE' }),
                });
                const data = await res.json();
                if (data.token) {
                  await AsyncStorage.setItem('token', data.token);
                  navigation.replace('Main');
                } else {
                  setError(data.error || 'Test Google login failed');
                }
                setLoading(false);
              }}
            >
              <Ionicons name="logo-google" size={22} color="#1976D2" />
              <Text style={styles.socialButtonText}>Test Google Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: '#e0e0e0', borderColor: '#000' }]}
              onPress={async () => {
                setLoading(true);
                setError('');
                const res = await fetch(`${API_BASE_URL}/api/users/social-login/apple`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ idToken: 'TEST_APPLE' }),
                });
                const data = await res.json();
                if (data.token) {
                  await AsyncStorage.setItem('token', data.token);
                  navigation.replace('Main');
                } else {
                  setError(data.error || 'Test Apple login failed');
                }
                setLoading(false);
              }}
            >
              <Ionicons name="logo-apple" size={22} color="#000" />
              <Text style={styles.socialButtonText}>Test Apple Login</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
      {verifyMessage ? <Text style={styles.error}>{verifyMessage}</Text> : null}
      <Modal visible={resetModalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.header}>Reset Password</Text>
            {resetStep === 'request' ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChangeText={setResetEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <TouchableOpacity style={styles.button} onPress={handlePasswordResetRequest}>
                  <Text style={styles.buttonText}>Send Reset Link</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Enter reset token"
                  value={resetToken}
                  onChangeText={setResetToken}
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="New password"
                  value={resetNewPassword}
                  onChangeText={setResetNewPassword}
                  secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                  <Text style={styles.buttonText}>Reset Password</Text>
                </TouchableOpacity>
              </>
            )}
            {resetMessage ? <Text style={styles.error}>{resetMessage}</Text> : null}
            <TouchableOpacity onPress={() => { setResetModalVisible(false); setResetStep('request'); setResetMessage(''); }}>
              <Text style={styles.switchText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={showVerifyModal} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.header}>Verify Your Email</Text>
            <Text style={{ marginBottom: 12, textAlign: 'center' }}>
              Please verify your email address to continue. Check your inbox for a verification link.
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleResendVerification} disabled={resendLoading}>
              <Text style={styles.buttonText}>{resendLoading ? 'Sending...' : 'Resend Verification Email'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCheckVerified}>
              <Text style={styles.buttonText}>Check Again</Text>
            </TouchableOpacity>
            {verifyMessage ? <Text style={styles.error}>{verifyMessage}</Text> : null}
            <TouchableOpacity onPress={() => setShowVerifyModal(false)}>
              <Text style={styles.switchText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7fa',
    padding: 24,
  },
  brand: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2a2a72',
    marginBottom: 16,
    letterSpacing: 4,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    color: '#2a2a72',
  },
  input: {
    width: '100%',
    maxWidth: 320,
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    maxWidth: 320,
    height: 48,
    backgroundColor: '#2a2a72',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  switchText: {
    color: '#2a2a72',
    fontSize: 16,
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  error: {
    color: 'red',
    marginBottom: 12,
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    marginBottom: 8,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    marginBottom: 8,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    marginLeft: 6,
    color: '#2a2a72',
    fontSize: 15,
  },
  forgotText: {
    color: '#2a2a72',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  socialContainer: {
    marginTop: 18,
    alignItems: 'center',
  },
  socialText: {
    color: '#888',
    marginBottom: 8,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
  },
  socialButtonText: {
    marginLeft: 8,
    color: '#2a2a72',
    fontWeight: '600',
    fontSize: 16,
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'linear-gradient(180deg, #e0eafc 0%, #cfdef3 100%)',
    zIndex: -1,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: 320,
    alignItems: 'center',
  },
}); 