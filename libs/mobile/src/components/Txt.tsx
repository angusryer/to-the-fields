import Animated from 'react-native-reanimated';

const Para = ({ children }: ChildrenProps) => {
  return <Animated.Text>{children}</Animated.Text>;
};

const Txt = {
  Para,
};

export default Txt;
