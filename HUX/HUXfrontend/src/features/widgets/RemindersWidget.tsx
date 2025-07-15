import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Switch } from 'react-native';
import RemindersService, { Reminder } from '../../services/RemindersService';

const RemindersWidget = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    const listener = (data: Reminder[]) => setReminders(data);
    RemindersService.subscribe(listener);
    return () => RemindersService.unsubscribe();
  }, []);

  const handleToggle = (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      RemindersService.removeReminder(id);
      RemindersService.addReminder({ title: reminder.title, time: reminder.time, enabled: !reminder.enabled });
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Reminders</Text>
      <FlatList
        data={reminders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            <Switch
              value={item.enabled}
              onValueChange={() => handleToggle(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No reminders</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: { alignItems: 'stretch', backgroundColor: '#fff', borderRadius: 16, padding: 20, margin: 8, elevation: 2, flex: 1 },
  label: { fontSize: 16, color: '#555', marginBottom: 8, fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#1976D2' },
  time: { fontSize: 14, color: '#888' },
  empty: { color: '#888', fontStyle: 'italic', textAlign: 'center', marginTop: 16 },
});

export default RemindersWidget; 