/**
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import { LightSwitch } from './light-switch.js';
import {StyleSheet, Text, View, Button} from 'react-native';

type Props = {};
export class LightSwitches extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Light Switches',
      headerRight: (
        <Button
          onPress={() => navigation.navigate('Home')}
          title="Home"
        />
      ),
    };
  };
  render() {
    return (
      <View style={styles.bulbGroup}>
        <LightSwitch switchId={200} />
        <LightSwitch switchId={208} />
        <LightSwitch switchId={202} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bulbGroup: {
    flex: 1,
    flexDirection: "row",
  },
});
