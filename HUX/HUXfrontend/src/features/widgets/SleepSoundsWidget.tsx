import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AppButton from '../../ui/components/AppButton';
import SleepSoundsService, { SleepSound } from '../../services/SleepSoundsService';

const SleepSoundsWidget = () => {
  const [sounds, setSounds] = useState<SleepSound[]>([]);

  useEffect(() => {
    const listener = (data: SleepSound[]) => setSounds(data);
    SleepSoundsService.subscribe(listener);
    return () => SleepSoundsService.unsubscribe();
  }, []);

  const handlePlay = (id: string) => {
    SleepSoundsService.playSound(id);
  };

  const handleStop = () => {
    SleepSoundsService.stopSound();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Sleep Sounds</Text>
      <FlatList
        data={sounds}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.duration}>{Math.round(item.duration / 60)} min</Text>
            </View>
            {item.playing ? (
              <AppButton title="Stop" onPress={handleStop} style={styles.button} />
            ) : (
              <AppButton title="Play" onPress={() => handlePlay(item.id)} style={styles.button} />
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No sounds</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: { alignItems: 'stretch', backgroundColor: '#fff', borderRadius: 16, padding: 20, margin: 8, elevation: 2, flex: 1 },
  label: { fontSize: 16, color: '#555', marginBottom: 8, fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#1976D2' },
  duration: { fontSize: 14, color: '#888' },
  button: { marginLeft: 8, minWidth: 80 },
  empty: { color: '#888', fontStyle: 'italic', textAlign: 'center', marginTop: 16 },
});

export default SleepSoundsWidget; 