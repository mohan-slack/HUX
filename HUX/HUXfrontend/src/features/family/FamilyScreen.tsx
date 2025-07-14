import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Image } from 'react-native';
import FamilyService, { FamilyMember } from '../../services/FamilyService';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import AppButton from '../../ui/components/AppButton';
import { colors, fontSizes, spacing } from '../../ui/theme';

const FamilyScreen: React.FC = () => {
  const [members, setMembers] = useState<FamilyMember[]>(FamilyService.getFamilyMembers());
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');

  useEffect(() => {
    FamilyService.subscribe(setMembers);
    return () => FamilyService.unsubscribe();
  }, []);

  const handleAdd = () => {
    if (name && relation) {
      FamilyService.addFamilyMember({ name, relation });
      setName('');
      setRelation('');
    }
  };

  const handleRemove = (id: string) => {
    FamilyService.removeFamilyMember(id);
  };

  const renderItem = ({ item }: { item: FamilyMember }) => (
    <AppCard style={styles.card}>
      {item.avatar ? (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      ) : null}
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.relation}>{item.relation}</Text>
      <AppButton title="Remove" onPress={() => handleRemove(item.id)} variant="outline" style={styles.buttonSmall} />
    </AppCard>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Family Sharing" />
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
          value={relation}
          onChangeText={setRelation}
          placeholder="Relation"
          placeholderTextColor={colors.textSecondary}
        />
        <AppButton title="Add" onPress={handleAdd} variant="secondary" style={styles.buttonSmall} />
      </View>
      <FlatList
        data={members}
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    marginBottom: 2,
    color: colors.text,
    textAlign: 'center',
  },
  relation: {
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

export default FamilyScreen; 