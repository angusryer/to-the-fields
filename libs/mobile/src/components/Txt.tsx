import { Text, TextStyle } from 'react-native';
import { useStyles } from '../utils/theme';

interface ITxtProps extends ChildrenProps {
  style?: TextStyle;
}

const Para = ({ children, style }: ITxtProps) => {
  const styles = useStyles((colors) => ({
    para: {
      color: colors.text,
    },
  }));
  return <Text style={[styles.para, style]}>{children}</Text>;
};

const H1 = ({ children, style }: ITxtProps) => {
  const styles = useStyles((colors) => ({
    h1: {
      color: colors.text,
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 16,
    },
  }));
  return <Text style={[styles.h1, style]}>{children}</Text>;
};

const Txt = {
  Para,
  H1,
};

export default Txt;
