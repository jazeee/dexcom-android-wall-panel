import React from 'react';
import { Text, Button, StyleSheet } from 'react-native';

import { COLORS } from '../common/colors';

const Header = props => {
  const { navigation } = props;
  return (
    <>
      <Button
        color={COLORS.primary}
        onPress={() => navigation.navigate('PlotView')}
        title="Cancel and Open Plot"
      />
      <Text
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}>
        Cancel/Home
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
