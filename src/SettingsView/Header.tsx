import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, StyleSheet } from 'react-native';

import { COLORS } from '../common/colors';

export function SettingsHeaderButtons() {
  const navigation = useNavigation();
  return (
    <>
      <Text style={styles.homeButton} onPress={() => navigation.goBack()}>
        Cancel
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  homeButton: {
    marginLeft: 8,
    marginRight: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
