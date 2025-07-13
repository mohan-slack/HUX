import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, fontSizes, spacing } from '../theme';

interface Props {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
  style?: ViewStyle;
}

const AppHeader: React.FC<Props> = ({ title, onBack, right, style }) => (
  <View style={[styles.container, style]}>
    {onBack && (
      <TouchableOpacity onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>{'←'}</Text>
      </TouchableOpacity>
    )}
    <Text style={styles.title}>{title}</Text>
    <View style={styles.right}>{right}</View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: {
    marginRight: spacing.md,
  },
  backText: {
    fontSize: fontSizes.lg,
    color: colors.primary,
  },
  title: {
    flex: 1,
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  right: {
    minWidth: 32,
    alignItems: 'flex-end',
  },
});

export default AppHeader; 