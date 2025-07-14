import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HydrationService, { HydrationData } from '../../services/HydrationService';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import AppButton from '../../ui/components/AppButton';
import { colors, fontSizes, spacing } from '../../ui/theme';

const HydrationTracker: React.FC = () => {
  const [hydration, setHydration] = useState<HydrationData>({ totalIntake: 0, timestamp: Date.now() });

  useEffect(() => {
    HydrationService.subscribe(setHydration);
    return () => HydrationService.unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <AppHeader title="Hydration Tracker" />
      <AppCard style={styles.card}>
        <Text style={styles.value}>{hydration.totalIntake} ml</Text>
        <View style={styles.buttonRow}>
          <AppButton title="+250ml" onPress={() => HydrationService.addIntake(250)} variant="primary" style={styles.buttonSmall} />
          <AppButton title="+500ml" onPress={() => HydrationService.addIntake(500)} variant="primary" style={styles.buttonSmall} />
        </View>
        <AppButton title="Reset" onPress={() => HydrationService.resetIntake()} variant="secondary" style={styles.button} />
      </AppCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  value: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.info,
    marginBottom: spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: spacing.sm,
  },
  button: {
    width: 180,
    marginBottom: spacing.sm,
  },
  buttonSmall: {
    width: 100,
    marginHorizontal: spacing.xs,
  },
});

export default HydrationTracker; 