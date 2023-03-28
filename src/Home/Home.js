import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { VISITED_SETTINGS_VIEW } from '../SettingsView/constants';

class Home extends React.Component {
  componentDidMount() {
    const { initialVisitState } = this.props.state;
    if (initialVisitState === VISITED_SETTINGS_VIEW) {
      this.props.navigation.navigate('PlotView');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Jazeee Data Monitor v2.0.0</Text>
        <Text style={styles.description}>
          This application reads data from an API and displays it in an
          always-on graph.
        </Text>
        <Text style={styles.warnings}>
          This app is for entertainment purposes only. Do not use for any other
          purpose. By using this app, you accept full liability for any and all
          damage. Use at your own risk.
        </Text>
        <Text style={styles.warnings}>
          Since the app keeps the screen on at full brightness, your device may
          experience burn-in or screen damage. By using this app, you accept
          full liability for any and all damage. Use at your own risk.
        </Text>
        <Text style={styles.warnings}>
          This app will use a small amount of network bandwidth, which may cost
          you. Use at your own risk.
        </Text>
      </View>
    );
  }
}

export default Home;

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
