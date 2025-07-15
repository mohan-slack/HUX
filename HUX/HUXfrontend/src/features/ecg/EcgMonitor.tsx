import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import EcgService, { EcgData } from '../../services/EcgService';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import AppButton from '../../ui/components/AppButton';
import { colors, fontSizes, spacing } from '../../ui/theme';

const EcgMonitor: React.FC = () => {
  const [ecg, setEcg] = useState<EcgData | null>(null);
  const [monitoring, setMonitoring] = useState(false);

  useEffect(() => {
    if (monitoring) {
      EcgService.startMonitoring(setEcg);
      return () => EcgService.stopMonitoring();
    } else {
      EcgService.stopMonitoring();
    }
  }, [monitoring]);

  return (
    <View style={styles.container}>
      <AppHeader title="ECG Monitor" />
      <AppCard style={styles.card}>
        <View style={styles.valueContainer}>
          {monitoring ? (
            ecg ? (
              <Text style={styles.value}>{ecg.value} ms</Text>
            ) : (
              <ActivityIndicator size="large" color={colors.primary} />
            )
          ) : (
            <Text style={styles.valueIdle}>--</Text>
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
  valueContainer: {
    marginBottom: spacing.lg,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.info,
  },
  valueIdle: {
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

export default EcgMonitor; 