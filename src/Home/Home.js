/**
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import DateTime from '../common/components/DateTime';

type Props = {};
export default class Home extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Home',
      headerRight: <DateTime />,
    };
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Jazeee Data Monitor v1.4.0</Text>
        <Text style={styles.description}>
          This application reads data from an API and displays it in an
          always-on graph.
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
        <Button
          onPress={() => this.props.navigation.navigate('PlotView')}
          title="Plot View"
        />
        <Button
          onPress={() => this.props.navigation.navigate('SettingsView')}
          title="Settings"
        />
      </View>
    );
  }
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
