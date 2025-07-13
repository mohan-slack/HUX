import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const WeeklyGoalBanner = () => (
  <View style={styles.banner}>
    <LottieView
      source={require('../../../assets/lottie/trophy.json')}
      autoPlay
      loop={false}
      style={{ width: 60, height: 60 }}
    />
    <Text style={styles.text}>Congrats! You hit your weekly goal!</Text>
  </View>
);

const styles = StyleSheet.create({
  banner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3FCEC', borderRadius: 12, padding: 16, margin: 8 },
  text: { fontSize: 16, color: '#1976D2', marginLeft: 12, fontWeight: 'bold' },
});

export default WeeklyGoalBanner; 