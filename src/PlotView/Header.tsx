import { useNavigation } from '@react-navigation/native';
import { Text, Button, StyleSheet } from 'react-native';

import { COLORS } from '../common/colors';

export function PlotViewHeaderButtons() {
  const { navigate } = useNavigation();
  return (
    <>
      <Button
        color={COLORS.primary}
        onPress={() => navigate('SettingsView' as never)}
        title="Settings"
      />
      <Text style={styles.homeButton} onPress={() => navigate('Home' as never)}>
        Home
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  homeButton: {
    marginLeft: 8,
    marginRight: 8,
    fontSize: 16,
    color: COLORS.primary,
  },
});
