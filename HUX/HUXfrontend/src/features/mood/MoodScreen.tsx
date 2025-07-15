import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import MoodService, { Mood } from '../../services/MoodService';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import AppButton from '../../ui/components/AppButton';
import { colors, fontSizes, spacing } from '../../ui/theme';

const MoodScreen: React.FC = () => {
  const [moods, setMoods] = useState<Mood[]>(MoodService.getMoods());
  const [date, setDate] = useState('');
  const [mood, setMood] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    MoodService.subscribe(setMoods);
    return () => MoodService.unsubscribe();
  }, []);

  const handleAdd = () => {
    if (date && mood) {
      MoodService.addMood({ date, mood, notes });
      setDate('');
      setMood('');
      setNotes('');
    }
  };

  const renderItem = ({ item }: { item: Mood }) => (
    <AppCard style={styles.card}>
      <Text style={styles.title}>{item.date}: {item.mood}</Text>
      {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
    </AppCard>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Mood Tracker" />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="Date (YYYY-MM-DD)"
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={styles.input}
          value={mood}
          onChangeText={setMood}
          placeholder="Mood (e.g., Happy)"
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={styles.input}
          value={notes}
          onChangeText={setNotes}
          placeholder="Notes"
          placeholderTextColor={colors.textSecondary}
        />
        <AppButton title="Add" onPress={handleAdd} variant="secondary" style={styles.buttonSmall} />
      </View>
      <FlatList
        data={moods}
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  input: {
    width: 120,
    fontSize: fontSizes.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    marginRight: spacing.sm,
    backgroundColor: colors.card,
    color: colors.text,
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
  notes: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  buttonSmall: {
    minWidth: 100,
    marginVertical: 2,
  },
});

export default MoodScreen; 