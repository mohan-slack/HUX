import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import FirmwareService, { FirmwareData } from '../../services/FirmwareService';

const FirmwareScreen: React.FC = () => {
  const [firmware, setFirmware] = useState<FirmwareData>(FirmwareService.getFirmwareVersion());

  const handleCheck = () => {
    setFirmware(FirmwareService.checkForUpdate());
  };

  const handleUpdate = () => {
    setFirmware(FirmwareService.updateFirmware());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firmware Update</Text>
      <Text style={styles.version}>Current: {firmware.currentVersion}</Text>
      <Text style={styles.version}>Latest: {firmware.latestVersion}</Text>
      <Text style={styles.status}>{firmware.updateAvailable ? 'Update Available' : 'Up to Date'}</Text>
      <Button title="Check for Update" onPress={handleCheck} />
      {firmware.updateAvailable && (
        <Button title="Update Firmware" onPress={handleUpdate} color="#1976D2" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  version: {
    fontSize: 18,
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    color: '#1976D2',
    marginBottom: 16,
  },
});

export default FirmwareScreen; 