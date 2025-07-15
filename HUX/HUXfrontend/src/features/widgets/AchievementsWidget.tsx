import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AchievementsService, { Achievement } from '../../services/AchievementsService';

const AchievementsWidget = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const listener = (data: Achievement[]) => setAchievements(data);
    AchievementsService.subscribe(listener);
    return () => AchievementsService.unsubscribe();
  }, []);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Achievements</Text>
      <FlatList
        data={achievements}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.emoji}>{item.unlocked ? '🏆' : '🔒'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.description}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No achievements</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: { alignItems: 'stretch', backgroundColor: '#fff', borderRadius: 16, padding: 20, margin: 8, elevation: 2, flex: 1 },
  label: { fontSize: 16, color: '#555', marginBottom: 8, fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  emoji: { fontSize: 24, marginRight: 8 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#1976D2' },
  desc: { fontSize: 14, color: '#888' },
  empty: { color: '#888', fontStyle: 'italic', textAlign: 'center', marginTop: 16 },
});

export default AchievementsWidget; 