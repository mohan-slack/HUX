import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import SOSService, { SOSData } from '../../services/SOSService';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import AppButton from '../../ui/components/AppButton';
import { colors, fontSizes, spacing } from '../../ui/theme';

const SOSScreen: React.FC = () => {
  const [history, setHistory] = useState<SOSData[]>(SOSService.getSOSHistory());

  useEffect(() => {
    SOSService.subscribe(setHistory);
    return () => SOSService.unsubscribe();
  }, []);

  const handleTrigger = () => {
    // Simulate location
    SOSService.triggerSOS('Bangalore, India');
  };

  const handleResolve = (id: string) => {
    SOSService.resolveSOS(id);
  };

  const renderItem = ({ item }: { item: SOSData }) => (
    <AppCard style={styles.card}>
      <Text style={styles.title}>{item.date}</Text>
      <Text style={styles.location}>{item.location}</Text>
      <Text style={styles.status}>{item.resolved ? 'Resolved' : 'Active'}</Text>
      {!item.resolved && (
        <AppButton title="Resolve" onPress={() => handleResolve(item.id)} variant="primary" style={styles.buttonSmall} />
      )}
    </AppCard>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="SOS / Emergency" />
      <AppButton title="Trigger SOS" onPress={handleTrigger} variant="outline" style={styles.triggerButton} />
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    padding: spacing.md,
  },
  list: {
    alignItems: 'center',
  },
  card: {
    minWidth: 250,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    color: colors.text,
    textAlign: 'center',
  },
  location: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  status: {
    fontSize: fontSizes.sm,
    color: colors.info,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  buttonSmall: {
    minWidth: 100,
    marginVertical: 2,
  },
  triggerButton: {
    minWidth: 180,
    marginBottom: spacing.lg,
  },
});

export default SOSScreen; 