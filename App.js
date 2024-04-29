/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import { LightSwitch } from './lights/light-switch.js';
import { JazComGlucose } from './jaz-com/glucose.js';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    KeepAwake.activate();
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>JazCom Monitor</Text>
        <View style={styles.dexGroup}>
          <JazComGlucose />
        </View>
        <View style={styles.bulbGroup}>
          <LightSwitch switchId={200} />
          <LightSwitch switchId={208} />
          <LightSwitch switchId={202} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: "#9cf",
  },
  instructions: {
    textAlign: 'center',
    color: '#eee',
    marginBottom: 5,
  },
  dexGroup: {
    flex: 3,
    flexDirection: "row",
  },
  bulbGroup: {
    flex: 1,
    flexDirection: "row",
  },
});
