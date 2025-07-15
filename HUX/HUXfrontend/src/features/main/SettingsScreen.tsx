import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(false);
  const [testPushLoading, setTestPushLoading] = useState(false);
  const [testPushMessage, setTestPushMessage] = useState('This is a test push notification from HUX!');
  const [testPushResult, setTestPushResult] = useState('');

  const handleClearData = async () => {
    Alert.alert('Clear All Data', 'Are you sure you want to clear all app data?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear', style: 'destructive', onPress: async () => {
          await AsyncStorage.clear();
          navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
        }
      }
    ]);
  };

  const handleTestPush = async () => {
    setTestPushLoading(true);
    setTestPushResult('');
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/users/test-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: testPushMessage }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setTestPushResult(data.error || 'Failed to send push notification');
      } else {
        setTestPushResult('Push notification sent!');
      }
    } catch (err) {
      setTestPushResult('Network error');
    }
    setTestPushLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>HUX</Text>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.optionRow}>
        <Text style={styles.optionLabel}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>
      <TouchableOpacity style={styles.clearButton} onPress={handleClearData}>
        <Text style={styles.clearButtonText}>Clear All App Data</Text>
      </TouchableOpacity>
      <View style={styles.pushTestBox}>
        <Text style={styles.pushTestLabel}>Test Push Notification</Text>
        <TextInput
          style={styles.input}
          value={testPushMessage}
          onChangeText={setTestPushMessage}
          placeholder="Enter push message"
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleTestPush} disabled={testPushLoading}>
          <Text style={styles.saveButtonText}>{testPushLoading ? 'Sending...' : 'Send Test Push'}</Text>
        </TouchableOpacity>
        {testPushResult ? <Text style={testPushResult === 'Push notification sent!' ? styles.success : styles.error}>{testPushResult}</Text> : null}
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Close</Text>
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
    marginBottom: 24,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 260,
    marginBottom: 32,
  },
  optionLabel: {
    fontSize: 18,
    color: '#444',
  },
  clearButton: {
    backgroundColor: '#fff',
    borderColor: '#e53935',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  clearButtonText: {
    color: '#e53935',
    fontSize: 16,
    fontWeight: '600',
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
  pushTestBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    width: 260,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pushTestLabel: {
    fontSize: 16,
    color: '#2a2a72',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#2a2a72',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  success: {
    color: '#4caf50',
    fontSize: 16,
    marginTop: 12,
  },
  error: {
    color: '#f44336',
    fontSize: 16,
    marginTop: 12,
  },
}); 