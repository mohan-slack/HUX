import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NotificationService, { NotificationData } from '../../services/NotificationService';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import AppButton from '../../ui/components/AppButton';
import { colors, fontSizes, spacing } from '../../ui/theme';

const NotificationsScreen: React.FC = () => {
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (subscribed) {
      NotificationService.subscribe(setNotification);
      return () => NotificationService.unsubscribe();
    } else {
      NotificationService.unsubscribe();
    }
  }, [subscribed]);

  return (
    <View style={styles.container}>
      <AppHeader title="Notifications" />
      {notification ? (
        <AppCard style={styles.card}>
          <Text style={styles.ntitle}>{notification.title}</Text>
          <Text style={styles.nmessage}>{notification.message}</Text>
          <Text style={styles.ntype}>{notification.type.toUpperCase()}</Text>
          <Text style={styles.ntime}>{new Date(notification.timestamp).toLocaleTimeString()}</Text>
        </AppCard>
      ) : (
        <Text style={styles.nmessage}>No notifications yet.</Text>
      )}
      <AppButton
        title={subscribed ? 'Unsubscribe' : 'Subscribe'}
        onPress={() => setSubscribed((s) => !s)}
        variant={subscribed ? 'secondary' : 'primary'}
        style={styles.button}
      />
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
    marginBottom: spacing.lg,
  },
  ntitle: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: colors.text,
    textAlign: 'center',
  },
  nmessage: {
    fontSize: fontSizes.md,
    marginBottom: spacing.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  ntype: {
    fontSize: fontSizes.sm,
    color: colors.info,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  ntime: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.md,
    minWidth: 180,
  },
});

export default NotificationsScreen; 