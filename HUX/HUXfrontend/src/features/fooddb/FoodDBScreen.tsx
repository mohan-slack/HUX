import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList } from 'react-native';
import FoodDBService, { FoodData } from '../../services/FoodDBService';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import AppButton from '../../ui/components/AppButton';
import { colors, fontSizes, spacing } from '../../ui/theme';

const FoodDBScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodData[]>([]);

  const handleSearch = () => {
    setResults(FoodDBService.searchFoods(query));
  };

  const renderItem = ({ item }: { item: FoodData }) => (
    <AppCard style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.info}>Calories: {item.calories} kcal</Text>
      <Text style={styles.info}>Protein: {item.protein}g | Carbs: {item.carbs}g | Fat: {item.fat}g</Text>
      <Text style={styles.info}>Serving: {item.servingSize}</Text>
    </AppCard>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Indian Food Database" />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Search food..."
          placeholderTextColor={colors.textSecondary}
        />
        <AppButton title="Search" onPress={handleSearch} variant="secondary" style={styles.buttonSmall} />
      </View>
      <FlatList
        data={results}
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
    width: 180,
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
  buttonSmall: {
    minWidth: 100,
    marginVertical: 2,
  },
});

export default FoodDBScreen; 