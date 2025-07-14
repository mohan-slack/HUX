import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import SleepSoundsService, { SleepSound } from '../../services/SleepSoundsService';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import AppButton from '../../ui/components/AppButton';
import { colors, fontSizes, spacing } from '../../ui/theme';

const SleepSoundsScreen: React.FC = () => {
  const [sounds, setSounds] = useState<SleepSound[]>(SleepSoundsService.getSounds());

  useEffect(() => {
    SleepSoundsService.subscribe(setSounds);
    return () => SleepSoundsService.unsubscribe();
  }, []);

  const handlePlay = (id: string) => {
    SleepSoundsService.playSound(id);
  };

  const handleStop = () => {
    SleepSoundsService.stopSound();
  };

  const renderItem = ({ item }: { item: SleepSound }) => (
    <AppCard style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.duration}>{Math.round(item.duration / 60)} min</Text>
      {item.playing ? (
        <AppButton title="Stop" onPress={handleStop} variant="outline" style={styles.buttonSmall} />
      ) : (
        <AppButton title="Play" onPress={() => handlePlay(item.id)} variant="primary" style={styles.buttonSmall} />
      )}
    </AppCard>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Sleep Sounds" />
      <FlatList
        data={sounds}
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

export default SleepSoundsScreen; 