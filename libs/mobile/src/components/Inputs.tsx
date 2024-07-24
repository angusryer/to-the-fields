import { StyleProp, TextInputProps, TextStyle } from 'react-native';
import { radii, spaces, useStyles } from '../utils/theme';
import { TextInput } from 'react-native-gesture-handler';

export const Input = ({
  placeholder,
  onChangeText,
  secureTextEntry,
  inputMode,
  textInputProps,
}: {
  placeholder: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  inputMode?: 'email' | 'text';
  textInputProps?: TextInputProps;
}) => {
  const styleProp: StyleProp<TextStyle> = textInputProps?.style ?? {};
  const styles = useStyles((colors) => ({
    textBox: {
      borderWidth: spaces[1],
      borderColor: colors.neutral,
      backgroundColor: colors.lightPrimary,
      borderRadius: radii.lg,
      padding: spaces[8],
      paddingHorizontal: spaces[16],
      margin: spaces[8],
    },
  }));

  return (
    <TextInput
      {...textInputProps}
      inputMode={inputMode}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      style={[styles.textBox, styleProp]}
    />
  );
};
