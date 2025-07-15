import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AppButton from '../../ui/components/AppButton';
import SpO2Service, { SpO2Data } from '../../services/SpO2Service';

const SpO2Widget = () => {
  const [spo2, setSpO2] = useState<number | null>(null);
  const [monitoring, setMonitoring] = useState(false);

  useEffect(() => {
    if (monitoring) {
      SpO2Service.startMonitoring((data: SpO2Data) => setSpO2(data.value));
    }
    return () => {
      SpO2Service.stopMonitoring();
    };
  }, [monitoring]);

  const handleStart = () => {
    setMonitoring(true);
    setSpO2(null);
  };

  const handleStop = () => {
    setMonitoring(false);
    setSpO2(null);
  };

  return (
    <View style={styles.card}>
      {monitoring && spo2 === null ? (
        <ActivityIndicator size="large" color="#1976D2" style={{ marginVertical: 8 }} />
      ) : (
        <Text style={styles.value}>{spo2 !== null ? `${spo2}%` : '--'}</Text>
      )}
      <Text style={styles.label}>SpO₂</Text>
      <AppButton
        title={monitoring ? 'Stop' : 'Start'}
        onPress={monitoring ? handleStop : handleStart}
        variant={monitoring ? 'outline' : 'primary'}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 20, margin: 8, elevation: 2, flex: 1 },
  value: { fontSize: 28, fontWeight: 'bold', color: '#1976D2' },
  label: { fontSize: 16, color: '#555' },
  button: { marginTop: 8, minWidth: 100 },
});

export default SpO2Widget; 