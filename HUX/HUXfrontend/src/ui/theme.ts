// theme.ts
export const colors = {
  primary: '#1976D2',
  secondary: '#0288D1',
  accent: '#FFC107',
  background: '#F1F5F9',
  card: '#FFFFFF',
  text: '#222',
  textSecondary: '#555',
  border: '#E0E0E0',
  error: '#D32F2F',
  success: '#388E3C',
  info: '#1976D2',
  warning: '#FFA000',
  dark: '#121212',
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 36,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = 12;

export const shadow = {
  shadowColor: colors.text,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2,
};

// Optional: dark mode helper
export const getTheme = (dark: boolean) => ({
  ...colors,
  background: dark ? colors.dark : colors.background,
  card: dark ? '#222' : colors.card,
  text: dark ? '#fff' : colors.text,
}); 