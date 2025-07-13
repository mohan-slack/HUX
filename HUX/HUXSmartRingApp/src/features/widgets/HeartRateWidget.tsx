import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';
import { HeartRateService } from '../../services/HeartRateService';
import AppButton from '../../ui/components/AppButton';

const HeartRateWidget = () => {
  const [bpm, setBpm] = useState<number | null>(null);
  const [monitoring, setMonitoring] = useState(false);

  useEffect(() => {
    const service = HeartRateService.getInstance();
    let listener: ((bpm: number) => void) | null = null;
    if (monitoring) {
      listener = (value: number) => setBpm(value);
      service.onHeartRateUpdate(listener);
      service.startMonitoring();
    }
    return () => {
      if (listener) service.offHeartRateUpdate();
      service.stopMonitoring();
    };
  }, [monitoring]);

  const handleStart = async () => {
    setMonitoring(true);
    setBpm(null);
  };

  const handleStop = async () => {
    setMonitoring(false);
    setBpm(null);
  };

  return (
    <View style={styles.card}>
      <LottieView
        source={require('../../../assets/lottie/heartbeat.json')}
        autoPlay
        loop
        style={{ width: 60, height: 60 }}
      />
      {monitoring && bpm === null ? (
        <ActivityIndicator size="large" color="#D32F2F" style={{ marginVertical: 8 }} />
      ) : (
        <Text style={styles.value}>{bpm !== null ? `${bpm} bpm` : '--'}</Text>
      )}
      <Text style={styles.label}>Heart Rate</Text>
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
  value: { fontSize: 28, fontWeight: 'bold', color: '#D32F2F' },
  label: { fontSize: 16, color: '#555' },
  button: { marginTop: 8, minWidth: 100 },
});

export default HeartRateWidget; 