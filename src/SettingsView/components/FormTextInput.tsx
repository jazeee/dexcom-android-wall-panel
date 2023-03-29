import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

import { COLORS } from '../../common/colors';

interface Props extends TextInputProps {
  value: string;
  setValue: (value: string) => void;
}

export const FormTextInput = (props: Props) => {
  const { value, setValue, ...otherProps } = props;
  return (
    <TextInput
      style={styles.textInput}
      value={value}
      autoCapitalize="none"
      autoCorrect={false}
      onChangeText={setValue}
      {...otherProps}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    backgroundColor: COLORS.textInputBackground,
    borderRadius: 48,
    paddingLeft: 8,
    marginRight: 8,
  },
});
