import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import MedicationService, { Medication } from '../../services/MedicationService';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import AppButton from '../../ui/components/AppButton';
import { colors, fontSizes, spacing } from '../../ui/theme';

const MedicationScreen: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>(MedicationService.getMedications());
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    MedicationService.subscribe(setMedications);
    return () => MedicationService.unsubscribe();
  }, []);

  const handleAdd = () => {
    if (name && dosage && time) {
      MedicationService.addMedication({ name, dosage, time });
      setName('');
      setDosage('');
      setTime('');
    }
  };

  const handleRemove = (id: string) => {
    MedicationService.removeMedication(id);
  };

  const handleMarkTaken = (id: string) => {
    MedicationService.markTaken(id);
  };

  const renderItem = ({ item }: { item: Medication }) => (
    <AppCard style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.info}>Dosage: {item.dosage}</Text>
      <Text style={styles.info}>Time: {item.time}</Text>
      <Text style={styles.status}>{item.taken ? 'Taken' : 'Not taken'}</Text>
      {!item.taken && (
        <AppButton title="Mark as Taken" onPress={() => handleMarkTaken(item.id)} variant="primary" style={styles.buttonSmall} />
      )}
      <AppButton title="Remove" onPress={() => handleRemove(item.id)} variant="outline" style={styles.buttonSmall} />
    </AppCard>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Medication Tracker" />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={styles.input}
          value={dosage}
          onChangeText={setDosage}
          placeholder="Dosage"
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={styles.input}
          value={time}
          onChangeText={setTime}
          placeholder="Time (e.g., 09:00)"
          placeholderTextColor={colors.textSecondary}
        />
        <AppButton title="Add" onPress={handleAdd} variant="secondary" style={styles.buttonSmall} />
      </View>
      <FlatList
        data={medications}
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
  info: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginBottom: 2,
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
});

export default MedicationScreen; 