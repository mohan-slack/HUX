import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Email update
  const [editEmail, setEditEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  // Change password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError('');
      setSuccess('');
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setError('Not logged in');
          setLoading(false);
          return;
        }
        const res = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          setError(data.error || 'Failed to fetch user');
          setLoading(false);
          return;
        }
        setUser(data.user);
        setEditEmail(data.user.email);
        setLoading(false);
      } catch (err) {
        setError('Network error');
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleUpdateEmail = async () => {
    setEmailLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: editEmail }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Failed to update email');
        setEmailLoading(false);
        return;
      }
      setUser(data.user);
      setSuccess('Email updated successfully!');
      setEmailLoading(false);
    } catch (err) {
      setError('Network error');
      setEmailLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPwLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/users/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Failed to change password');
        setPwLoading(false);
        return;
      }
      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setPwLoading(false);
    } catch (err) {
      setError('Network error');
      setPwLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>HUX</Text>
      <Text style={styles.title}>Profile</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2a2a72" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : user ? (
        <>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Email:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={styles.input}
                value={editEmail}
                onChangeText={setEditEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {user.emailVerified ? (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={22} color="#4caf50" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              ) : (
                <View style={styles.unverifiedBadge}>
                  <Ionicons name="alert-circle" size={22} color="#ff9800" />
                  <Text style={styles.unverifiedText}>Not Verified</Text>
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleUpdateEmail} disabled={emailLoading}>
              <Text style={styles.saveButtonText}>{emailLoading ? 'Saving...' : 'Save Email'}</Text>
            </TouchableOpacity>
            <Text style={styles.infoLabel}>User ID:</Text>
            <Text style={styles.infoValue}>{user.userId || user.id}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Change Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="New password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword} disabled={pwLoading}>
              <Text style={styles.saveButtonText}>{pwLoading ? 'Saving...' : 'Change Password'}</Text>
            </TouchableOpacity>
          </View>
          {success ? <Text style={styles.success}>{success}</Text> : null}
        </>
      ) : null}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.buttonText}>Open Settings</Text>
      </TouchableOpacity>
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2a2a72',
    marginBottom: 12,
    letterSpacing: 4,
  },
  title: {
    fontSize: 28,
    color: '#2a2a72',
    marginBottom: 8,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 24,
    alignItems: 'flex-start',
    minWidth: 220,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  infoLabel: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
  },
  infoValue: {
    fontSize: 18,
    color: '#2a2a72',
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2a2a72',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  input: {
    width: 220,
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#2a2a72',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  success: {
    color: 'green',
    marginBottom: 16,
    fontSize: 16,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  verifiedText: {
    color: '#4caf50',
    marginLeft: 4,
    fontWeight: '600',
  },
  unverifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  unverifiedText: {
    color: '#ff9800',
    marginLeft: 4,
    fontWeight: '600',
  },
}); 