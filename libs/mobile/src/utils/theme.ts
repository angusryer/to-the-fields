import { Theme, useTheme } from '@react-navigation/native';
import { DependencyList, useMemo } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

const commonColors: Omit<
  Theme['colors'],
  'background' | 'card' | 'text' | 'border'
> = {
  primary: '#007bff',
  darkPrimary: '#191e29',
  lightPrimary: '#132d46',
  neutral: '#0c138d',
  darkSecondary: '#696e78',
  lightSecondary: '#ffffff',
  error: '#fd0c5a',
  success: '#00c851',
  warning: '#ffbb33',
  info: '#33b5e5',
  notification: '#33b5e5',
};

export const light: Theme['colors'] = {
  ...commonColors,
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#333333',
  border: '#cccccc',
};

export const dark: Theme['colors'] = {
  ...commonColors,
  background: '#121212',
  card: '#1f2430',
  text: '#e0e0e0',
  border: '#2e3440',
};

export const colors: Record<'light' | 'dark', Theme['colors']> = {
  light,
  dark,
};

export const spaces = {
  ['1']: 1,
  ['2']: 2,
  ['4']: 4,
  ['6']: 6,
  ['8']: 8,
  ['12']: 12,
  ['16']: 16,
  ['20']: 20,
  ['24']: 24,
  ['28']: 28,
  ['32']: 32,
  ['36']: 36,
  ['40']: 40,
  ['44']: 44,
  ['48']: 48,
  ['52']: 52,
  ['56']: 56,
  ['60']: 60,
  ['64']: 64,
  ['72']: 72,
  ['80']: 80,
  ['96']: 96,
  ['128']: 128,
  ['160']: 160,
  ['192']: 192,
  ['224']: 224,
  ['256']: 256,
  ['320']: 320,
  ['384']: 384,
  ['448']: 448,
  ['512']: 512,
  ['640']: 640,
  ['768']: 768,
  ['896']: 896,
  ['1024']: 1024,
};

export const radii = {
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999,
};

export const shadows: ViewStyle = {
  shadowColor: '#aaa',
  shadowOffset: {
    width: 1,
    height: 1,
  },
  shadowOpacity: 1,
  shadowRadius: 10,
  elevation: 5,
};

/**
 * Returns a memoized StyleSheet object with the styles based on the current theme.
 */
export const useStyles = <
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>,
>(
  create: (colors: Theme['colors']) => T,
  deps: DependencyList = [],
): T => {
  const { dark, colors } = useTheme();
  colors;
  return useMemo(
    () => StyleSheet.create(create(colors)),
    [colors, ...deps, dark],
  );
};
