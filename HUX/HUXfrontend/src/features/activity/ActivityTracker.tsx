import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ActivityService, { ActivityData } from '../../services/ActivityService';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import AppButton from '../../ui/components/AppButton';
import { colors, fontSizes, spacing } from '../../ui/theme';

const ActivityTracker: React.FC = () => {
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    if (tracking) {
      ActivityService.startTracking(setActivity);
      return () => ActivityService.stopTracking();
    } else {
      ActivityService.stopTracking();
    }
  }, [tracking]);

  return (
    <View style={styles.container}>
      <AppHeader title="Activity Tracker" />
      <AppCard style={styles.card}>
        <Text style={styles.value}>{activity ? `${activity.steps} steps` : '--'}</Text>
        <Text style={styles.detail}>{activity ? `${activity.distance.toFixed(1)} m` : ''}</Text>
        <Text style={styles.detail}>{activity ? `${activity.calories} kcal` : ''}</Text>
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

export default ActivityTracker; 