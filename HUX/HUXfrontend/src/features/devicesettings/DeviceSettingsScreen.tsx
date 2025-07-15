import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import AppButton from '../../ui/components/AppButton';
import { colors, fontSizes, spacing } from '../../ui/theme';

const DeviceSettingsScreen: React.FC = () => {
  const [vibration, setVibration] = useState(true);
  const [led, setLed] = useState(true);
  const [airplane, setAirplane] = useState(false);

  const handleReset = () => {
    Alert.alert('Device Reset', 'Device has been reset (stub).');
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Device Settings" />
      <AppCard style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Vibration</Text>
          <Switch value={vibration} onValueChange={setVibration} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>LED</Text>
          <Switch value={led} onValueChange={setLed} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Airplane Mode</Text>
          <Switch value={airplane} onValueChange={setAirplane} />
        </View>
        <AppButton title="Reset Device" onPress={handleReset} variant="outline" style={styles.button} />
      </AppCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  card: {
    width: '90%',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginTop: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSizes.md,
    color: colors.text,
  },
  button: {
    minWidth: 180,
    marginTop: spacing.lg,
  },
});

export default DeviceSettingsScreen; 