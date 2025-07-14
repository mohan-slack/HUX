import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { HeartRateService, HeartRateStatus } from '../../services/HeartRateService';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import AppButton from '../../ui/components/AppButton';
import { colors, fontSizes, spacing } from '../../ui/theme';

const HeartRateMonitor: React.FC = () => {
  const [bpm, setBpm] = useState<number | null>(null);
  const [status, setStatus] = useState<HeartRateStatus>('idle');

  useEffect(() => {
    const service = HeartRateService.getInstance();
    const listener = (value: number) => setBpm(value);
    service.onHeartRateUpdate(listener);
    setStatus(service.getStatus());
    return () => {
      service.offHeartRateUpdate();
    };
  }, []);

  const start = async () => {
    setStatus('monitoring');
    await HeartRateService.getInstance().startMonitoring();
  };

  const stop = async () => {
    setStatus('idle');
    await HeartRateService.getInstance().stopMonitoring();
    setBpm(null);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Real-Time Heart Rate" />
      <AppCard style={styles.card}>
        <View style={styles.bpmContainer}>
          {status === 'monitoring' ? (
            bpm !== null ? (
              <Text style={styles.bpm}>{bpm} bpm</Text>
            ) : (
              <ActivityIndicator size="large" color={colors.primary} />
            )
          ) : (
            <Text style={styles.bpmIdle}>-- bpm</Text>
          )}
        </View>
        <AppButton
          title={status === 'monitoring' ? 'Stop' : 'Start'}
          onPress={status === 'monitoring' ? stop : start}
          variant={status === 'monitoring' ? 'secondary' : 'primary'}
          style={styles.button}
        />
        <Text style={styles.statusText}>Status: {status}</Text>
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
  bpmContainer: {
    marginBottom: spacing.lg,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bpm: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.success,
  },
  bpmIdle: {
    fontSize: fontSizes.xxl,
    color: colors.textSecondary,
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

export default HeartRateMonitor; 