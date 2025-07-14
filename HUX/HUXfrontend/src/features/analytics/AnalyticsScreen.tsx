import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import { colors, fontSizes, spacing } from '../../ui/theme';

const AnalyticsScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppHeader title="Advanced Analytics" />
      <AppCard style={styles.card}>
        <Text style={styles.header}>Steps</Text>
        <Text style={styles.value}>8,200</Text>
        <Text style={styles.sub}>Goal: 10,000</Text>
      </AppCard>
      <AppCard style={styles.card}>
        <Text style={styles.header}>Sleep</Text>
        <Text style={styles.value}>7.2 h</Text>
        <Text style={styles.sub}>Goal: 8 h</Text>
      </AppCard>
      <AppCard style={styles.card}>
        <Text style={styles.header}>Heart Rate</Text>
        <Text style={styles.value}>Avg: 72 bpm</Text>
        <Text style={styles.sub}>Range: 60-110 bpm</Text>
      </AppCard>
      <AppCard style={styles.card}>
        <Text style={styles.header}>Hydration</Text>
        <Text style={styles.value}>1,600 ml</Text>
        <Text style={styles.sub}>Goal: 2,000 ml</Text>
      </AppCard>
      {/* Add more analytics as needed */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  card: {
    minWidth: 250,
    width: '90%',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  header: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    color: colors.text,
    textAlign: 'center',
  },
  value: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.primary,
    textAlign: 'center',
  },
  sub: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default AnalyticsScreen; 