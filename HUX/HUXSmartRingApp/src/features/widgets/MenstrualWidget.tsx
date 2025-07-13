import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from '../../ui/components/AppButton';
import MenstrualService, { Cycle } from '../../services/MenstrualService';

const MenstrualWidget = () => {
  const [cycles, setCycles] = useState<Cycle[]>([]);

  useEffect(() => {
    const listener = (data: Cycle[]) => setCycles(data);
    MenstrualService.subscribe(listener);
    return () => MenstrualService.unsubscribe();
  }, []);

  const handleAddCycle = () => {
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    const endDate = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    MenstrualService.addCycle({ startDate, endDate });
  };

  const current = cycles[cycles.length - 1];

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Menstrual Cycle</Text>
      {current ? (
        <>
          <Text style={styles.value}>Current: {current.startDate} - {current.endDate}</Text>
          <Text style={styles.notes}>{current.notes || ''}</Text>
        </>
      ) : (
        <Text style={styles.empty}>No cycle data</Text>
      )}
      <AppButton title="Add Cycle" onPress={handleAddCycle} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 20, margin: 8, elevation: 2, flex: 1 },
  label: { fontSize: 16, color: '#555', marginBottom: 8, fontWeight: 'bold' },
  value: { fontSize: 16, color: '#1976D2', marginBottom: 4 },
  notes: { fontSize: 14, color: '#888', marginBottom: 8 },
  button: { marginTop: 8, minWidth: 100 },
  empty: { color: '#888', fontStyle: 'italic', textAlign: 'center', marginTop: 16 },
});

export default MenstrualWidget; 