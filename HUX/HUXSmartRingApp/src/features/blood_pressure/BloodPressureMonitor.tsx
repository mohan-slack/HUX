import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { BloodPressureService, BloodPressureRecord } from '../../services/BloodPressureService';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import AppButton from '../../ui/components/AppButton';
import { colors, fontSizes, spacing } from '../../ui/theme';

const BloodPressureMonitor: React.FC = () => {
  const [bp, setBp] = useState<BloodPressureRecord | null>(null);
  const [monitoring, setMonitoring] = useState(false);

  useEffect(() => {
    const service = BloodPressureService.getInstance();
    let listener: ((record: BloodPressureRecord) => void) | null = null;
    let isMounted = true;
    if (monitoring) {
      listener = (record: BloodPressureRecord) => { if (isMounted) setBp(record); };
      service.onBpUpdate(listener);
      service.startMonitoring();
    }
    return () => {
      isMounted = false;
      if (listener) service.offBpUpdate();
      service.stopMonitoring();
    };
  }, [monitoring]);

  return (
    <View style={styles.container}>
      <AppHeader title="Blood Pressure" />
      <AppCard style={styles.card}>
        <View style={styles.bpContainer}>
          {monitoring ? (
            bp ? (
              <Text style={styles.bp}>{bp.systolic}/{bp.diastolic} mmHg</Text>
            ) : (
              <ActivityIndicator size="large" color={colors.primary} />
            )
          ) : (
            <Text style={styles.bpIdle}>--/-- mmHg</Text>
          )}
        </View>
        <AppButton
          title={monitoring ? 'Stop' : 'Start'}
          onPress={() => setMonitoring((m) => !m)}
          variant={monitoring ? 'secondary' : 'primary'}
          style={styles.button}
        />
        <Text style={styles.statusText}>{monitoring ? 'Monitoring...' : 'Paused'}</Text>
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
  bpContainer: {
    marginBottom: spacing.lg,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bp: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.info,
  },
  bpIdle: {
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

export default BloodPressureMonitor; 