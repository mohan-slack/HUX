import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from '../../ui/components/AppButton';
import MoodService, { Mood } from '../../services/MoodService';

const moods = [
  { mood: 'Happy', emoji: '😃' },
  { mood: 'Sad', emoji: '😢' },
  { mood: 'Stressed', emoji: '😰' },
  { mood: 'Relaxed', emoji: '😌' },
  { mood: 'Angry', emoji: '😡' },
];

const MoodWidget = () => {
  const [latest, setLatest] = useState<Mood | null>(null);
  const [moodIdx, setMoodIdx] = useState(0);

  useEffect(() => {
    const listener = (moodsArr: Mood[]) => setLatest(moodsArr[moodsArr.length - 1] || null);
    MoodService.subscribe(listener);
    return () => MoodService.unsubscribe();
  }, []);

  const handleCycleMood = () => {
    const nextIdx = (moodIdx + 1) % moods.length;
    setMoodIdx(nextIdx);
    MoodService.addMood({ date: new Date().toISOString(), mood: moods[nextIdx].mood });
  };

  const moodMeta = moods.find(m => m.mood === (latest?.mood || 'Happy')) || moods[0];

  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{moodMeta.emoji}</Text>
      <Text style={styles.value}>{moodMeta.mood}</Text>
      <Text style={styles.notes}>{latest?.notes || ''}</Text>
      <AppButton title="Cycle Mood" onPress={handleCycleMood} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 20, margin: 8, elevation: 2, flex: 1 },
  emoji: { fontSize: 40, marginBottom: 8 },
  value: { fontSize: 20, fontWeight: 'bold', color: '#1976D2' },
  notes: { fontSize: 14, color: '#888', marginBottom: 8 },
  button: { marginTop: 8, minWidth: 100 },
});

export default MoodWidget; 