import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HydrationBar = ({ progress, value, goal }: { progress: number; value: string; goal: string }) => (
  <View style={styles.card}>
    <Text style={styles.label}>Hydration</Text>
    <View style={styles.barBackground}>
      <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
    </View>
    <Text style={styles.value}>{value} / {goal}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, margin: 8, elevation: 2, flex: 1, alignItems: 'center' },
  label: { fontSize: 16, color: '#1976D2', marginBottom: 8 },
  barBackground: { width: '100%', height: 12, backgroundColor: '#E0E0E0', borderRadius: 6, overflow: 'hidden', marginBottom: 8 },
  barFill: { height: 12, backgroundColor: '#1976D2', borderRadius: 6 },
  value: { fontSize: 14, color: '#555' },
});

export default HydrationBar; 