import React from 'react';
import { Text, Button, StyleSheet } from 'react-native';

import { COLORS } from '../common/colors';

export const PlotViewHeaderButtons = (props: any) => {
  const { navigation } = props;
  return (
    <>
      <Button
        color={COLORS.primary}
        onPress={() => navigation.navigate('SettingsView')}
        title="Settings"
      />
      <Text
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}>
        Home
      </Text>
    </>
  );
};

export default PlotViewHeaderButtons;

const styles = StyleSheet.create({
  homeButton: {
    marginLeft: 8,
    marginRight: 8,
    fontSize: 16,
    color: COLORS.primary,
  },
});
