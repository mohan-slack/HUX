import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AppButton from '../../ui/components/AppButton';
import { BloodPressureService, BloodPressureRecord } from '../../services/BloodPressureService';

const BloodPressureWidget = () => {
  const [bp, setBp] = useState<BloodPressureRecord | null>(null);
  const [monitoring, setMonitoring] = useState(false);

  useEffect(() => {
    const service = BloodPressureService.getInstance();
    let listener: ((record: BloodPressureRecord) => void) | null = null;
    if (monitoring) {
      listener = (record: BloodPressureRecord) => setBp(record);
      service.onBpUpdate(listener);
      service.startMonitoring();
    }
    return () => {
      if (listener) service.offBpUpdate();
      service.stopMonitoring();
    };
  }, [monitoring]);

  const handleStart = async () => {
    setMonitoring(true);
    setBp(null);
  };

  const handleStop = async () => {
    setMonitoring(false);
    setBp(null);
  };

  return (
    <View style={styles.card}>
      {monitoring && bp === null ? (
        <ActivityIndicator size="large" color="#1976D2" style={{ marginVertical: 8 }} />
      ) : (
        <Text style={styles.value}>
          {bp ? `${bp.systolic}/${bp.diastolic}` : '--/--'}
          <Text style={styles.unit}> mmHg</Text>
        </Text>
      )}
      <Text style={styles.pulse}>{bp ? `Pulse: ${bp.pulse} bpm` : 'Pulse: --'}</Text>
      <Text style={styles.label}>Blood Pressure</Text>
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
  unit: { fontSize: 16, color: '#888' },
  pulse: { fontSize: 16, color: '#D32F2F', marginBottom: 4 },
  label: { fontSize: 16, color: '#555' },
  button: { marginTop: 8, minWidth: 100 },
});

export default BloodPressureWidget; 