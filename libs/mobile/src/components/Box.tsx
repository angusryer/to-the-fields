import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import Animated from 'react-native-reanimated';
import { spaces, useStyles } from '../utils/theme';

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
}

export const Screen = ({ children, ...rest }: ScreenProps) => {
  const styles = useStyles((colors) => ({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
  }));

  return (
    <Animated.View style={[styles.screen]} {...rest}>
      {children}
    </Animated.View>
  );
};

const Box = {
  Screen,
};

export default Box;
