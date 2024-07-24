import { Pressable, PressableProps, Text, TextProps } from 'react-native';
import { radii, shadows, spaces, useStyles } from '../utils/theme';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export interface ButtonProps {
  children?: React.JSX.Element | string;
  onPress?: PressableProps['onPress'];
  pressableProps?: PressableProps;
  textProps?: TextProps;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button = ({
  children,
  onPress,
  pressableProps,
  textProps,
}: ButtonProps) => {
  const styles = useStyles((colors) => ({
    button: {
      borderWidth: spaces[1],
      padding: spaces[8],
      marginVertical: spaces[8],
      borderRadius: radii.sm,
      backgroundColor: colors.background,
      borderColor: colors.neutral,
      ...shadows,
    },
    text: {
      color: colors.neutral,
      alignSelf: 'center',
    },
  }));

  const scale = useSharedValue(1);
  const translate = useSharedValue({ x: 0, y: 0 });
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translate.value.x },
        { translateY: translate.value.y },
      ],
    };
  });

  return (
    <AnimatedPressable
      {...pressableProps}
      style={[styles.button, animatedStyles]}
      onPressIn={() => {
        scale.value = withSpring(0.99);
        translate.value = withSpring({ x: -1, y: 1 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
        translate.value = withSpring({ x: 0, y: 0 });
      }}
      onPress={onPress}>
      {typeof children === 'string' ? (
        <Text style={styles.text} {...textProps}>
          {children}
        </Text>
      ) : (
        children
      )}
    </AnimatedPressable>
  );
};
