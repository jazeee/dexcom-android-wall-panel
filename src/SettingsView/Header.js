import React from 'react';
import { Text, StyleSheet } from 'react-native';

import { COLORS } from '../common/colors';

const Header = props => {
  const { navigation } = props;
  return (
    <>
      <Text style={styles.homeButton} onPress={() => navigation.goBack()}>
        Cancel
      </Text>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  homeButton: {
    marginLeft: 8,
    marginRight: 8,
    fontSize: 16,
    color: COLORS.primary,
  },
});
