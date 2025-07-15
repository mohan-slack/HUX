import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SUPPORTED_RING_MODELS, RingModel } from '../../models/RingModel';

const DeviceModelList: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Supported HUX Smart Ring Models</Text>
      <FlatList
        data={SUPPORTED_RING_MODELS}
        keyExtractor={(item) => item.modelNumber}
        renderItem={({ item }) => <RingModelCard model={item} />}
      />
    </View>
  );
};

const RingModelCard: React.FC<{ model: RingModel }> = ({ model }) => (
  <View style={styles.card}>
    <Text style={styles.modelName}>{model.name} ({model.modelNumber})</Text>
    <Text style={styles.features}>Features: {model.features.join(', ')}</Text>
    {model.notes && <Text style={styles.notes}>{model.notes}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F1F5F9',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  modelName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  features: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 2,
  },
  notes: {
    fontSize: 12,
    color: '#64748B',
  },
});

export default DeviceModelList; 