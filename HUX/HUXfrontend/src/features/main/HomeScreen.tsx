import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>HUX</Text>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.message}>Welcome to the HUX Home Screen!</Text>
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
  message: {
    fontSize: 18,
    color: '#444',
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