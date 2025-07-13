import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import ExportService from '../../services/ExportService';

const ExportScreen: React.FC = () => {
  const [exported, setExported] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Export Data</Text>
      <View style={styles.buttonRow}>
        <Button title="Export to CSV" onPress={() => setExported(ExportService.exportToCSV())} />
        <Button title="Export to JSON" onPress={() => setExported(ExportService.exportToJSON())} />
      </View>
      <ScrollView style={styles.exportBox}>
        <Text style={styles.exportText}>{exported}</Text>
      </ScrollView>
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 16,
  },
  exportBox: {
    width: '100%',
    minHeight: 100,
    maxHeight: 200,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 12,
  },
  exportText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ExportScreen; 