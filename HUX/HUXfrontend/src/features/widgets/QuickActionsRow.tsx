import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const actions = [
  { icon: 'local-drink', label: 'Log Water' },
  { icon: 'note-add', label: 'Add Note' },
  { icon: 'directions-run', label: 'Workout' },
];

const QuickActionsRow = () => (
  <View style={styles.row}>
    {actions.map((a) => (
      <TouchableOpacity key={a.label} style={styles.action}>
        <MaterialIcons name={a.icon as any} size={28} color="#1976D2" />
        <Text style={styles.label}>{a.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginVertical: 8 },
  action: { alignItems: 'center', marginHorizontal: 12 },
  label: { fontSize: 12, color: '#1976D2', marginTop: 4 },
});

export default QuickActionsRow; 