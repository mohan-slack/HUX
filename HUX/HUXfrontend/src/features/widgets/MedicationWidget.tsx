import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AppButton from '../../ui/components/AppButton';
import MedicationService, { Medication } from '../../services/MedicationService';

const MedicationWidget = () => {
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    const listener = (meds: Medication[]) => setMedications(meds);
    MedicationService.subscribe(listener);
    return () => MedicationService.unsubscribe();
  }, []);

  const handleMarkTaken = (id: string) => {
    MedicationService.markTaken(id);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Medication</Text>
      <FlatList
        data={medications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.medRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.medName}>{item.name}</Text>
              <Text style={styles.medInfo}>{item.dosage} @ {item.time}</Text>
            </View>
            <AppButton
              title={item.taken ? 'Taken' : 'Mark Taken'}
              onPress={() => handleMarkTaken(item.id)}
              disabled={item.taken}
              variant={item.taken ? 'outline' : 'primary'}
              style={styles.button}
            />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No medications</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: { alignItems: 'stretch', backgroundColor: '#fff', borderRadius: 16, padding: 20, margin: 8, elevation: 2, flex: 1 },
  label: { fontSize: 16, color: '#555', marginBottom: 8, fontWeight: 'bold' },
  medRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  medName: { fontSize: 16, fontWeight: 'bold', color: '#1976D2' },
  medInfo: { fontSize: 14, color: '#888' },
  button: { marginLeft: 8, minWidth: 80 },
  empty: { color: '#888', fontStyle: 'italic', textAlign: 'center', marginTop: 16 },
});

export default MedicationWidget; 