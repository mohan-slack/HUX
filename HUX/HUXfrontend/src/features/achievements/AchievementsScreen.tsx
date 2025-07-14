import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import AchievementsService, { Achievement } from '../../services/AchievementsService';

const AchievementsScreen: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(AchievementsService.getAchievements());

  useEffect(() => {
    AchievementsService.subscribe(setAchievements);
    return () => AchievementsService.unsubscribe();
  }, []);

  const renderItem = ({ item }: { item: Achievement }) => (
    <View style={[styles.card, item.unlocked && styles.unlocked]}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.status}>{item.unlocked ? `Unlocked${item.timestamp ? ' at ' + new Date(item.timestamp).toLocaleString() : ''}` : 'Locked'}</Text>
      {!item.unlocked && (
        <Button title="Unlock (Demo)" onPress={() => AchievementsService.unlockAchievement(item.id)} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Achievements</Text>
      <FlatList
        data={achievements}
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    minWidth: 250,
  },
  unlocked: {
    backgroundColor: '#C8E6C9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  desc: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    textAlign: 'center',
  },
  status: {
    fontSize: 14,
    color: '#1976D2',
    marginBottom: 8,
  },
});

export default AchievementsScreen; 