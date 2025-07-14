import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from '../../ui/components/AppButton';
import HydrationService, { HydrationData } from '../../services/HydrationService';

const HydrationWidget = () => {
  const [intake, setIntake] = useState<number>(0);

  useEffect(() => {
    const listener = (data: HydrationData) => setIntake(data.totalIntake);
    HydrationService.subscribe(listener);
    return () => HydrationService.unsubscribe();
  }, []);

  const handleAdd = () => {
    HydrationService.addIntake(250); // Add 250ml
  };

  const handleReset = () => {
    HydrationService.resetIntake();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.value}>{intake} ml</Text>
      <Text style={styles.label}>Hydration</Text>
      <View style={styles.buttonRow}>
        <AppButton title="+250ml" onPress={handleAdd} style={styles.button} />
        <AppButton title="Reset" onPress={handleReset} variant="outline" style={styles.button} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 20, margin: 8, elevation: 2, flex: 1 },
  value: { fontSize: 28, fontWeight: 'bold', color: '#1976D2' },
  label: { fontSize: 16, color: '#555', marginBottom: 8 },
  buttonRow: { flexDirection: 'row', marginTop: 8 },
  button: { marginHorizontal: 4, minWidth: 80 },
});

export default HydrationWidget; 