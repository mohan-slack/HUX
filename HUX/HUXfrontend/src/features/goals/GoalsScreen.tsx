import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import GoalsService, { GoalsData } from '../../services/GoalsService';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import AppButton from '../../ui/components/AppButton';
import { colors, fontSizes, spacing } from '../../ui/theme';

const GoalsScreen: React.FC = () => {
  const [goals, setGoals] = useState<GoalsData>(GoalsService.getGoals());
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    GoalsService.subscribe(setGoals);
    return () => GoalsService.unsubscribe();
  }, []);

  const handleSave = () => {
    GoalsService.updateGoal(goals);
    setEditing(false);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Daily Goals" />
      <AppCard style={styles.card}>
        <TextInput
          style={styles.input}
          value={String(goals.steps)}
          editable={editing}
          keyboardType="numeric"
          onChangeText={(text) => setGoals({ ...goals, steps: Number(text) })}
          placeholder="Steps"
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={styles.input}
          value={String(goals.sleep)}
          editable={editing}
          keyboardType="numeric"
          onChangeText={(text) => setGoals({ ...goals, sleep: Number(text) })}
          placeholder="Sleep (hours)"
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={styles.input}
          value={String(goals.hydration)}
          editable={editing}
          keyboardType="numeric"
          onChangeText={(text) => setGoals({ ...goals, hydration: Number(text) })}
          placeholder="Hydration (ml)"
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={styles.input}
          value={String(goals.calories)}
          editable={editing}
          keyboardType="numeric"
          onChangeText={(text) => setGoals({ ...goals, calories: Number(text) })}
          placeholder="Calories (kcal)"
          placeholderTextColor={colors.textSecondary}
        />
        <View style={styles.buttonRow}>
          {editing ? (
            <AppButton title="Save" onPress={handleSave} variant="primary" style={styles.button} />
          ) : (
            <AppButton title="Edit" onPress={() => setEditing(true)} variant="secondary" style={styles.button} />
          )}
        </View>
      </AppCard>
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
    width: '90%',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginTop: spacing.lg,
  },
  input: {
    width: '80%',
    fontSize: fontSizes.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.md,
    backgroundColor: colors.card,
    color: colors.text,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  button: {
    minWidth: 120,
    marginHorizontal: spacing.sm,
  },
});

export default GoalsScreen; 