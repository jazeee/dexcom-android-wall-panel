import React from 'react';
import { Button, View, StyleSheet } from 'react-native';

import { COLORS } from '../common/colors';

const Header = props => {
  const { navigation } = props;
  return (
    <>
      <View style={styles.button}>
        <Button
          color={COLORS.primary}
          onPress={() => navigation.navigate('SettingsView')}
          title="Settings"
        />
      </View>
      <View style={styles.rightButton}>
        <Button
          color={COLORS.primary}
          onPress={() => navigation.navigate('PlotView')}
          title="Plot"
        />
      </View>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  rightButton: {
    marginLeft: 8,
    marginRight: 8,
  },
});
