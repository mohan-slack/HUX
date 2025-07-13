import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StressService, { StressData } from '../../services/StressService';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import AppButton from '../../ui/components/AppButton';
import { colors, fontSizes, spacing } from '../../ui/theme';

const StressMonitor: React.FC = () => {
  const [stress, setStress] = useState<StressData | null>(null);
  const [monitoring, setMonitoring] = useState(false);

  useEffect(() => {
    if (monitoring) {
      StressService.startMonitoring(setStress);
      return () => StressService.stopMonitoring();
    } else {
      StressService.stopMonitoring();
    }
  }, [monitoring]);

  return (
    <View style={styles.container}>
      <AppHeader title="Stress Monitor" />
      <AppCard style={styles.card}>
        <Text style={styles.value}>{stress ? `${stress.stressLevel}` : '--'}</Text>
        <Text style={styles.status}>{monitoring ? 'Monitoring...' : 'Paused'}</Text>
        <AppButton
          title={monitoring ? 'Stop' : 'Start'}
          onPress={() => setMonitoring((m) => !m)}
          variant={monitoring ? 'secondary' : 'primary'}
          style={styles.button}
        />
      </AppCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  card: {
    minWidth: 250,
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.xl,
  },
  value: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  status: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  button: {
    minWidth: 180,
  },
});

export default StressMonitor; 