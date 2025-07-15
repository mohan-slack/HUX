import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ScrollView } from 'react-native';
import SOSAutoService, { AutoSOSData } from '../../services/SOSAutoService';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import AppButton from '../../ui/components/AppButton';
import { colors, fontSizes, spacing } from '../../ui/theme';

const SOSAutoScreen: React.FC = () => {
  const [history, setHistory] = useState<AutoSOSData[]>(SOSAutoService.getAutoSOSHistory());
  const [customValue, setCustomValue] = useState('');
  const [customThreshold, setCustomThreshold] = useState('');
  const [customType, setCustomType] = useState('');

  useEffect(() => {
    SOSAutoService.subscribe(setHistory);
    return () => SOSAutoService.unsubscribe();
  }, []);

  const handleDetectBP = () => {
    SOSAutoService.detectBP(190);
  };
  const handleDetectOxygen = () => {
    SOSAutoService.detectOxygen(85);
  };
  const handleDetectGlucose = () => {
    SOSAutoService.detectGlucose(300);
  };
  const handleDetectHeartRate = () => {
    SOSAutoService.detectHeartRate(140);
  };
  const handleDetectTemperature = () => {
    SOSAutoService.detectTemperature(40);
  };
  const handleDetectFall = () => {
    SOSAutoService.detectFall();
  };
  const handleDetectCustom = () => {
    if (customType && customValue && customThreshold) {
      SOSAutoService.detectCustom(customType, Number(customValue), Number(customThreshold));
      setCustomType('');
      setCustomValue('');
      setCustomThreshold('');
    }
  };
  const handleResolve = (id: string) => {
    SOSAutoService.resolveSOS(id);
  };

  const renderItem = ({ item }: { item: AutoSOSData }) => (
    <AppCard style={styles.card}>
      <Text style={styles.title}>{item.date}</Text>
      <Text style={styles.sensor}>{item.sensorType}</Text>
      <Text style={styles.value}>Value: {item.sensorValue} (Threshold: {item.threshold})</Text>
      <Text style={styles.status}>{item.resolved ? 'Resolved' : 'Active'}</Text>
      {!item.resolved && (
        <AppButton title="Resolve" onPress={() => handleResolve(item.id)} variant="primary" style={styles.buttonSmall} />
      )}
    </AppCard>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppHeader title="Auto SOS (Sensor Detection)" />
      <View style={styles.buttonRow}>
        <AppButton title="High BP" onPress={handleDetectBP} variant="secondary" style={styles.buttonSmall} />
        <AppButton title="Low Oxygen" onPress={handleDetectOxygen} variant="secondary" style={styles.buttonSmall} />
        <AppButton title="High Glucose" onPress={handleDetectGlucose} variant="secondary" style={styles.buttonSmall} />
      </View>
      <View style={styles.buttonRow}>
        <AppButton title="High Heart Rate" onPress={handleDetectHeartRate} variant="secondary" style={styles.buttonSmall} />
        <AppButton title="High Temp" onPress={handleDetectTemperature} variant="secondary" style={styles.buttonSmall} />
        <AppButton title="Fall" onPress={handleDetectFall} variant="secondary" style={styles.buttonSmall} />
      </View>
      <View style={styles.customRow}>
        <TextInput
          style={styles.input}
          value={customType}
          onChangeText={setCustomType}
          placeholder="Sensor Type"
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={styles.input}
          value={customValue}
          onChangeText={setCustomValue}
          placeholder="Value"
          keyboardType="numeric"
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={styles.input}
          value={customThreshold}
          onChangeText={setCustomThreshold}
          placeholder="Threshold"
          keyboardType="numeric"
          placeholderTextColor={colors.textSecondary}
        />
        <AppButton title="Custom" onPress={handleDetectCustom} variant="primary" style={styles.buttonSmall} />
      </View>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  list: {
    alignItems: 'center',
  },
  card: {
    minWidth: 250,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    color: colors.text,
    textAlign: 'center',
  },
  sensor: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  value: {
    fontSize: fontSizes.sm,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  status: {
    fontSize: fontSizes.sm,
    color: colors.info,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: spacing.sm,
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    width: '100%',
    flexWrap: 'wrap',
  },
  input: {
    width: 100,
    fontSize: fontSizes.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.xs,
    marginRight: spacing.sm,
    backgroundColor: colors.card,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  buttonSmall: {
    minWidth: 100,
    marginVertical: 2,
  },
});

export default SOSAutoScreen; 