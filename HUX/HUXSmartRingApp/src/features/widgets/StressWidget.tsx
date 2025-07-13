import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AppButton from '../../ui/components/AppButton';
import StressService, { StressData } from '../../services/StressService';

const StressWidget = () => {
  const [stress, setStress] = useState<number | null>(null);
  const [monitoring, setMonitoring] = useState(false);

  useEffect(() => {
    if (monitoring) {
      StressService.startMonitoring((data: StressData) => setStress(data.stressLevel));
    }
    return () => {
      StressService.stopMonitoring();
    };
  }, [monitoring]);

  const handleStart = () => {
    setMonitoring(true);
    setStress(null);
  };

  const handleStop = () => {
    setMonitoring(false);
    setStress(null);
  };

  return (
    <View style={styles.card}>
      {monitoring && stress === null ? (
        <ActivityIndicator size="large" color="#1976D2" style={{ marginVertical: 8 }} />
      ) : (
        <Text style={styles.value}>{stress !== null ? `${stress}` : '--'}</Text>
      )}
      <Text style={styles.label}>Stress</Text>
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

export default StressWidget; 