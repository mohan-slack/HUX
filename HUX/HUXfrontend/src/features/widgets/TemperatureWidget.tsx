import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AppButton from '../../ui/components/AppButton';
import TemperatureService, { TemperatureData } from '../../services/TemperatureService';

const TemperatureWidget = () => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [monitoring, setMonitoring] = useState(false);

  useEffect(() => {
    if (monitoring) {
      TemperatureService.startMonitoring((data: TemperatureData) => setTemperature(data.value));
    }
    return () => {
      TemperatureService.stopMonitoring();
    };
  }, [monitoring]);

  const handleStart = () => {
    setMonitoring(true);
    setTemperature(null);
  };

  const handleStop = () => {
    setMonitoring(false);
    setTemperature(null);
  };

  return (
    <View style={styles.card}>
      {monitoring && temperature === null ? (
        <ActivityIndicator size="large" color="#1976D2" style={{ marginVertical: 8 }} />
      ) : (
        <Text style={styles.value}>{temperature !== null ? `${temperature.toFixed(1)}°C` : '--'}</Text>
      )}
      <Text style={styles.label}>Temperature</Text>
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

export default TemperatureWidget; 