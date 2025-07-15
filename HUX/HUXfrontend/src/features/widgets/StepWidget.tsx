import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AppButton from '../../ui/components/AppButton';
import { StepService } from '../../services/StepService';

const StepWidget = () => {
  const [steps, setSteps] = useState<number | null>(null);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    const service = StepService.getInstance();
    let listener: ((steps: number) => void) | null = null;
    if (tracking) {
      listener = (value: number) => setSteps(value);
      service.onStepUpdate(listener);
      service.startTracking();
    }
    return () => {
      if (listener) service.offStepUpdate();
      service.stopTracking();
    };
  }, [tracking]);

  const handleStart = async () => {
    setTracking(true);
    setSteps(null);
  };

  const handleStop = async () => {
    setTracking(false);
    setSteps(null);
  };

  return (
    <View style={styles.card}>
      {tracking && steps === null ? (
        <ActivityIndicator size="large" color="#1976D2" style={{ marginVertical: 8 }} />
      ) : (
        <Text style={styles.value}>{steps !== null ? `${steps}` : '--'}</Text>
      )}
      <Text style={styles.label}>Steps</Text>
      <AppButton
        title={tracking ? 'Stop' : 'Start'}
        onPress={tracking ? handleStop : handleStart}
        variant={tracking ? 'outline' : 'primary'}
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

export default StepWidget; 