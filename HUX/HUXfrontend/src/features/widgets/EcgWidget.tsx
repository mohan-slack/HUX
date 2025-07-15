import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AppButton from '../../ui/components/AppButton';
import { EcgService, EcgRecord } from '../../services/EcgService';
import Svg, { Polyline } from 'react-native-svg';

const EcgWidget = () => {
  const [ecg, setEcg] = useState<EcgRecord | null>(null);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    const service = EcgService.getInstance();
    let listener: ((record: EcgRecord) => void) | null = null;
    if (recording) {
      listener = (record: EcgRecord) => setEcg(record);
      service.onEcgUpdate(listener);
      service.startEcg();
    }
    return () => {
      if (listener) service.offEcgUpdate();
      service.stopEcg();
    };
  }, [recording]);

  const handleStart = async () => {
    setRecording(true);
    setEcg(null);
  };

  const handleStop = async () => {
    setRecording(false);
    setEcg(null);
  };

  // Sparkline rendering
  const width = 120, height = 40;
  const points = ecg && ecg.data && ecg.data.length > 0
    ? ecg.data.map((v, i) => `${(i / (ecg.data.length - 1)) * width},${height - (v / 100) * height}`).join(' ')
    : '';

  return (
    <View style={styles.card}>
      <Text style={styles.label}>ECG</Text>
      {recording && (!ecg || !ecg.data || ecg.data.length === 0) ? (
        <ActivityIndicator size="large" color="#1976D2" style={{ marginVertical: 8 }} />
      ) : (
        <Svg width={width} height={height} style={styles.sparkline}>
          <Polyline
            points={points}
            fill="none"
            stroke="#1976D2"
            strokeWidth="2"
          />
        </Svg>
      )}
      <Text style={styles.value}>{ecg ? `${ecg.duration}s` : '--'}</Text>
      <Text style={styles.durationLabel}>Duration</Text>
      <AppButton
        title={recording ? 'Stop' : 'Start'}
        onPress={recording ? handleStop : handleStart}
        variant={recording ? 'outline' : 'primary'}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 20, margin: 8, elevation: 2, flex: 1 },
  label: { fontSize: 16, color: '#555', marginBottom: 4 },
  sparkline: { marginVertical: 8 },
  value: { fontSize: 24, fontWeight: 'bold', color: '#1976D2' },
  durationLabel: { fontSize: 14, color: '#888', marginBottom: 8 },
  button: { marginTop: 8, minWidth: 100 },
});

export default EcgWidget; 