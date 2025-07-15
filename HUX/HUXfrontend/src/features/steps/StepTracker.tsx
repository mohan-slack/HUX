import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StepService, StepData } from '../../services/StepService';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import AppButton from '../../ui/components/AppButton';
import { colors, fontSizes, spacing } from '../../ui/theme';

const StepTracker: React.FC = () => {
  const [steps, setSteps] = useState<StepData | null>(null);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    const service = StepService.getInstance();
    let listener: ((data: StepData) => void) | null = null;
    if (tracking) {
      listener = (data: StepData) => setSteps(data);
      service.onStepUpdate(listener);
      service.startTracking();
    }
    return () => {
      if (listener) service.offStepUpdate();
      service.stopTracking();
    };
  }, [tracking]);

  return (
    <View style={styles.container}>
      <AppHeader title="Step Tracker" />
      <AppCard style={styles.card}>
        <Text style={styles.value}>{steps ? `${steps.count} steps` : '--'}</Text>
        <AppButton
          title={tracking ? 'Stop' : 'Start'}
          onPress={() => setTracking((t) => !t)}
          variant={tracking ? 'secondary' : 'primary'}
          style={styles.button}
        />
        <Text style={styles.statusText}>{tracking ? 'Tracking...' : 'Paused'}</Text>
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
    color: colors.success,
    marginBottom: spacing.sm,
  },
  button: {
    width: 180,
    marginBottom: spacing.sm,
  },
  statusText: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
});

export default StepTracker; 