import { useNavigation } from '@react-navigation/native';
import { Button, View, StyleSheet } from 'react-native';

import { COLORS } from '../common/colors';

export const HomeHeaderButtons = () => {
  const { navigate } = useNavigation();
  return (
    <>
      <View style={styles.button}>
        <Button
          color={COLORS.primary}
          onPress={() => navigate('SettingsView' as never)}
          title="Settings"
        />
      </View>
      <View style={styles.rightButton}>
        <Button
          color={COLORS.primary}
          onPress={() => navigate('PlotView' as never)}
          title="Plot"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  button: {},
  rightButton: {
    marginLeft: 8,
    marginRight: 8,
  },
});
