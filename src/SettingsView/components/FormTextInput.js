import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

import { COLORS } from '../../common/colors';

type Props = {
  value: string,
  setValue: (value: string) => {},
};

const FormTextInput = (props: Props) => {
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

export default FormTextInput;

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    backgroundColor: COLORS.textInputBackground,
    borderRadius: 48,
    paddingLeft: 8,
    marginRight: 8,
  },
});
