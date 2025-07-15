import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, FlatList } from 'react-native';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import { colors, fontSizes, spacing } from '../../ui/theme';

const defaultWidgets = [
  { id: 'steps', name: 'Steps', enabled: true },
  { id: 'heart', name: 'Heart Rate', enabled: true },
  { id: 'weather', name: 'Weather', enabled: false },
  { id: 'battery', name: 'Battery', enabled: true },
];

const WidgetsScreen: React.FC = () => {
  const [widgets, setWidgets] = useState(defaultWidgets);

  const toggleWidget = (id: string) => {
    setWidgets(widgets =>
      widgets.map(w =>
        w.id === id ? { ...w, enabled: !w.enabled } : w
      )
    );
  };

  const renderItem = ({ item }: { item: typeof defaultWidgets[0] }) => (
    <AppCard style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Switch value={item.enabled} onValueChange={() => toggleWidget(item.id)} />
    </AppCard>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Custom Widgets" />
      <FlatList
        data={widgets}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    padding: spacing.md,
  },
  list: {
    alignItems: 'center',
  },
  card: {
    minWidth: 250,
    alignItems: 'center',
    marginBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.text,
  },
});

export default WidgetsScreen; 