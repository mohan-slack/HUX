import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import MenstrualService, { Cycle } from '../../services/MenstrualService';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import AppButton from '../../ui/components/AppButton';
import { colors, fontSizes, spacing } from '../../ui/theme';

const MenstrualScreen: React.FC = () => {
  const [cycles, setCycles] = useState<Cycle[]>(MenstrualService.getCycles());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    MenstrualService.subscribe(setCycles);
    return () => MenstrualService.unsubscribe();
  }, []);

  const handleAdd = () => {
    if (startDate && endDate) {
      MenstrualService.addCycle({ startDate, endDate, notes });
      setStartDate('');
      setEndDate('');
      setNotes('');
    }
  };

  const renderItem = ({ item }: { item: Cycle }) => (
    <AppCard style={styles.card}>
      <Text style={styles.title}>{item.startDate} - {item.endDate}</Text>
      {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
    </AppCard>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Menstrual Tracker" />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={startDate}
          onChangeText={setStartDate}
          placeholder="Start Date (YYYY-MM-DD)"
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={styles.input}
          value={endDate}
          onChangeText={setEndDate}
          placeholder="End Date (YYYY-MM-DD)"
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
        data={cycles}
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

export default MenstrualScreen; 