import React, { DependencyList, useMemo } from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import Animated from 'react-native-reanimated';
import { Theme, useTheme } from '@react-navigation/native';

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
}

export const Screen = ({ children, ...rest }: ScreenProps) => {
  const styles = useStyles((colors) => ({
    screen: {
      ...boxStyles.screen,
      backgroundColor: colors.background,
    },
  }));

  return (
    <Animated.View style={[styles.screen]} {...rest}>
      {children}
    </Animated.View>
  );
};

const boxStyles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

const Box = {
  Screen,
};

export default Box;

export const useStyles = <
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>,
>(
  create: (colors: Theme['colors']) => T,
  deps: DependencyList = [],
): T => {
  const { dark, colors } = useTheme();
  return useMemo(
    () => StyleSheet.create(create(colors)),
    [colors, ...deps, dark],
  );
};
