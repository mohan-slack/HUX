import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import RemindersService, { Reminder } from '../../services/RemindersService';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import AppButton from '../../ui/components/AppButton';
import { colors, fontSizes, spacing } from '../../ui/theme';

const RemindersScreen: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>(RemindersService.getReminders());
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    RemindersService.subscribe(setReminders);
    return () => RemindersService.unsubscribe();
  }, []);

  const handleAdd = () => {
    if (title && time) {
      RemindersService.addReminder({ title, time, enabled: true });
      setTitle('');
      setTime('');
    }
  };

  const handleRemove = (id: string) => {
    RemindersService.removeReminder(id);
  };

  const renderItem = ({ item }: { item: Reminder }) => (
    <AppCard style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.time}>{item.time}</Text>
      <AppButton title="Remove" onPress={() => handleRemove(item.id)} variant="outline" style={styles.buttonSmall} />
    </AppCard>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Reminders" />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={styles.input}
          value={time}
          onChangeText={setTime}
          placeholder="Time (e.g., 08:00)"
          placeholderTextColor={colors.textSecondary}
        />
        <AppButton title="Add" onPress={handleAdd} variant="secondary" style={styles.buttonSmall} />
      </View>
      <FlatList
        data={reminders}
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
    width: 100,
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
  time: {
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

export default RemindersScreen; 