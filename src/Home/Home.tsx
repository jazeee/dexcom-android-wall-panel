import { useNavigation } from '@react-navigation/native';
import { Button, StyleSheet, Text } from 'react-native';
import { COLORS } from '../common/colors';
import { version } from '../../package.json';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InsetView } from '../common/components/InsetView';

export function Home() {
  const { navigate } = useNavigation();
  const insets = useSafeAreaInsets();
  return (
    <InsetView style={styles.container}>
      <Text style={styles.welcome}>Jazeee Data Monitor v{version}</Text>
      <Text style={styles.description}>
        This application reads data from an API and displays it in an always-on
        graph.
      </Text>
      <Text style={styles.warnings}>
        This app is for entertainment purposes only. Do not use for any other
        purpose. By using this app, you accept full liability for any and all
        damage. Use at your own risk.
      </Text>
      <Text style={styles.warnings}>
        Since the app keeps the screen on at full brightness, your device may
        experience burn-in or screen damage. By using this app, you accept full
        liability for any and all damage. Use at your own risk.
      </Text>
      <Text style={styles.warnings}>
        This app will use a small amount of network bandwidth, which may cost
        you. Use at your own risk.
      </Text>
      <Button
        color={COLORS.primary}
        onPress={() => navigate('AudioTest' as never)}
        title="Test Audio"
      />
    </InsetView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#9cf',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    margin: 10,
    color: '#ddd',
  },
  warnings: {
    fontSize: 14,
    textAlign: 'center',
    margin: 10,
    color: '#fc2',
  },
});
