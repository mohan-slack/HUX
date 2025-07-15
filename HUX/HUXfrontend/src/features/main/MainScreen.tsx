import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function MainScreen() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    Alert.alert('Logged out', 'You have been logged out.');
    navigation.replace('Auth');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>HUX</Text>
      <Text style={styles.welcome}>Welcome to the HUX App!</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
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
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2a2a72',
    marginBottom: 16,
    letterSpacing: 4,
  },
  welcome: {
    fontSize: 22,
    color: '#2a2a72',
    marginBottom: 32,
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
}); 