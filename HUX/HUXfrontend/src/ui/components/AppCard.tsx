import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, shadow } from '../theme';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

const AppCard: React.FC<Props> = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius,
    padding: 20,
    marginVertical: 8,
    ...shadow,
  },
});

export default AppCard; 