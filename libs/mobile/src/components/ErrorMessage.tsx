import React, { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Txt from './Txt';
import { useStyles } from '../utils/theme';

const MESSAGE_TIMEOUT = 1000;

export const ErrorMessage = ({ children }: { children?: string }) => {
  const errorTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const styles = useStyles((colors) => ({
    text: {
      color: colors.error,
    },
  }));

  const opacity = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    if (children) {
      opacity.value = 1;
      errorTimerRef.current = setTimeout(() => {
        opacity.value = withTiming(0);
      }, MESSAGE_TIMEOUT);
    }
    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, [children]);

  if (!children) return null;
  return (
    <Animated.View style={[animatedStyles]}>
      <Txt.Para style={styles.text}>{children}</Txt.Para>
    </Animated.View>
  );
};
