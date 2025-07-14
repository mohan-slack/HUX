import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

interface Props {
  score: number;
  trend: number[]; // e.g., [70, 80, 75, 90, 85, 95, 88]
}

const SleepScoreCard: React.FC<Props> = ({ score, trend }) => {
  // Normalize trend for sparkline
  const width = 100, height = 32;
  const min = Math.min(...trend), max = Math.max(...trend);
  const points = trend
    .map((v, i) => {
      const x = (i / (trend.length - 1)) * width;
      const y = height - ((v - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Sleep Score</Text>
      <Text style={styles.score}>{score}</Text>
      <Svg width={width} height={height} style={styles.sparkline}>
        <Polyline
          points={points}
          fill="none"
          stroke="#1976D2"
          strokeWidth="3"
        />
      </Svg>
      <Text style={styles.trendLabel}>Last 7 days</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    margin: 8,
    flex: 1,
  },
  title: { fontSize: 18, color: '#555' },
  score: { fontSize: 36, fontWeight: 'bold', color: '#1976D2', marginVertical: 4 },
  sparkline: { marginVertical: 8 },
  trendLabel: { fontSize: 12, color: '#888' },
});

export default SleepScoreCard; 