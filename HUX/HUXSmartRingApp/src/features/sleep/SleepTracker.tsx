import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SleepService, SleepSummary } from '../../services/SleepService';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import AppButton from '../../ui/components/AppButton';
import { colors, fontSizes, spacing } from '../../ui/theme';

const SleepTracker: React.FC = () => {
  const [sleep, setSleep] = useState<SleepSummary | null>(null);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    const service = SleepService.getInstance();
    let listener: ((summary: SleepSummary) => void) | null = null;
    if (tracking) {
      listener = (summary: SleepSummary) => setSleep(summary);
      service.onSleepUpdate(listener);
      service.startTracking();
    }
    return () => {
      if (listener) service.offSleepUpdate();
      service.stopTracking();
    };
  }, [tracking]);

  return (
    <View style={styles.container}>
      <AppHeader title="Sleep Tracker" />
      <AppCard style={styles.card}>
        <Text style={styles.value}>{sleep ? `${(sleep.duration / 60).toFixed(1)} h` : '--'}</Text>
        <Text style={styles.detail}>{sleep ? `${sleep.quality}` : ''}</Text>
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
    color: colors.info,
    marginBottom: spacing.sm,
  },
  detail: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
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

export default SleepTracker; 