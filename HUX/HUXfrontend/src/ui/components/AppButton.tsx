import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { colors, fontSizes, borderRadius } from '../theme';

type Variant = 'primary' | 'secondary' | 'outline';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

const AppButton: React.FC<Props> = ({ title, onPress, variant = 'primary', loading, disabled, style }) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return [styles.button, { backgroundColor: colors.secondary }];
      case 'outline':
        return [styles.button, styles.outline];
      default:
        return [styles.button, { backgroundColor: colors.primary }];
    }
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), disabled && styles.disabled, style]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : '#fff'} />
      ) : (
        <Text style={[styles.text, variant === 'outline' && { color: colors.primary }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: 120,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  text: {
    color: '#fff',
    fontSize: fontSizes.md,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default AppButton; 