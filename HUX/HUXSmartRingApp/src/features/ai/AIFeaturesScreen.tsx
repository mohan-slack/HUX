import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AppHeader from '../../ui/components/AppHeader';
import AppCard from '../../ui/components/AppCard';
import { colors, fontSizes, spacing } from '../../ui/theme';

const aiFeatures = [
  { id: '1', name: 'Health Insights', desc: 'Personalized health insights based on your data.' },
  { id: '2', name: 'Anomaly Detection', desc: 'Detect unusual patterns in your health metrics.' },
  { id: '3', name: 'Smart Recommendations', desc: 'Get actionable tips to improve your wellness.' },
  { id: '4', name: 'Predictive Alerts', desc: 'AI-powered alerts for potential health issues.' },
];

const AIFeaturesScreen: React.FC = () => {
  const renderItem = ({ item }: { item: typeof aiFeatures[0] }) => (
    <AppCard style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.desc}>{item.desc}</Text>
    </AppCard>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="AI Features" />
      <FlatList
        data={aiFeatures}
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
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    color: colors.text,
    textAlign: 'center',
  },
  desc: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default AIFeaturesScreen; 