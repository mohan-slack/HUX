import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import TemperatureService, { TemperatureData } from '../../services/TemperatureService';

const TemperatureMonitor: React.FC = () => {
  const [temperature, setTemperature] = useState<TemperatureData | null>(null);
  const [monitoring, setMonitoring] = useState(false);

  useEffect(() => {
    if (monitoring) {
      TemperatureService.startMonitoring(setTemperature);
      return () => TemperatureService.stopMonitoring();
    } else {
      TemperatureService.stopMonitoring();
    }
  }, [monitoring]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Temperature Monitor</Text>
      <Text style={styles.value}>{temperature ? `${temperature.value.toFixed(1)}°C` : '--'}</Text>
      <Text style={styles.status}>{monitoring ? 'Monitoring...' : 'Paused'}</Text>
      <Button
        title={monitoring ? 'Stop' : 'Start'}
        onPress={() => setMonitoring((m) => !m)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  value: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 8,
  },
  status: {
    fontSize: 18,
    color: '#888',
    marginBottom: 24,
  },
});

export default TemperatureMonitor; 