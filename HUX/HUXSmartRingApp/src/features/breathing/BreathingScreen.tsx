import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import BreathingService, { BreathingExercise } from '../../services/BreathingService';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import AppButton from '../../ui/components/AppButton';
import { colors, fontSizes, spacing } from '../../ui/theme';

const BreathingScreen: React.FC = () => {
  const [exercises, setExercises] = useState<BreathingExercise[]>(BreathingService.getExercises());

  useEffect(() => {
    BreathingService.subscribe(setExercises);
    return () => BreathingService.unsubscribe();
  }, []);

  const handleStart = (id: string) => {
    BreathingService.startExercise(id);
  };

  const handleStop = () => {
    BreathingService.stopExercise();
  };

  const renderItem = ({ item }: { item: BreathingExercise }) => (
    <AppCard style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.duration}>{Math.round(item.duration / 60)} min</Text>
      {item.active ? (
        <AppButton title="Stop" onPress={handleStop} variant="outline" style={styles.buttonSmall} />
      ) : (
        <AppButton title="Start" onPress={() => handleStart(item.id)} variant="primary" style={styles.buttonSmall} />
      )}
    </AppCard>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Breathing Exercises" />
      <FlatList
        data={exercises}
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
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    color: colors.text,
    textAlign: 'center',
  },
  duration: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  buttonSmall: {
    minWidth: 100,
    marginVertical: 2,
  },
});

export default BreathingScreen; 