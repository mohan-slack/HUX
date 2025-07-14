import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import ActivityRing from './widgets/ActivityRing';
import SleepScoreCard from './widgets/SleepScoreCard';
import HeartRateWidget from './widgets/HeartRateWidget';
import HydrationBar from './widgets/HydrationBar';
import WeeklyGoalBanner from './widgets/WeeklyGoalBanner';
import QuickActionsRow from './widgets/QuickActionsRow';
import StepWidget from './widgets/StepWidget';
import SpO2Widget from './widgets/SpO2Widget';
import TemperatureWidget from './widgets/TemperatureWidget';
import StressWidget from './widgets/StressWidget';
import BloodPressureWidget from './widgets/BloodPressureWidget';
import EcgWidget from './widgets/EcgWidget';
import HydrationWidget from './widgets/HydrationWidget';
import MedicationWidget from './widgets/MedicationWidget';
import MoodWidget from './widgets/MoodWidget';
import RemindersWidget from './widgets/RemindersWidget';
import AchievementsWidget from './widgets/AchievementsWidget';
import MenstrualWidget from './widgets/MenstrualWidget';
import SleepSoundsWidget from './widgets/SleepSoundsWidget';

const DashboardScreen = () => (
  <ScrollView contentContainerStyle={styles.container}>
    <WeeklyGoalBanner />
    <View style={styles.gridRow}>
      <ActivityRing progress={0.72} value="7,200" label="Steps" />
      <SleepScoreCard score={88} trend={[70, 80, 75, 90, 85, 95, 88]} />
    </View>
    <View style={styles.gridRow}>
      <HeartRateWidget />
      <HydrationBar progress={0.6} value="1200ml" goal="2000ml" />
    </View>
    <View style={styles.gridRow}>
      <StepWidget />
      <SpO2Widget />
    </View>
    <View style={styles.gridRow}>
      <TemperatureWidget />
      <StressWidget />
    </View>
    <View style={styles.gridRow}>
      <BloodPressureWidget />
      <EcgWidget />
    </View>
    <View style={styles.gridRow}>
      <HydrationWidget />
      <MedicationWidget />
    </View>
    <View style={styles.gridRow}>
      <MoodWidget />
    </View>
    <View style={styles.gridRow}>
      <RemindersWidget />
      <AchievementsWidget />
    </View>
    <View style={styles.gridRow}>
      <MenstrualWidget />
      <SleepSoundsWidget />
    </View>
    <QuickActionsRow />
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F1F5F9',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
});

export default DashboardScreen; 