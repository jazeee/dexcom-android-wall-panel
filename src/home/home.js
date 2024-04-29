/**
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component, Fragment} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';

type Props = {};
export class Home extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Home',
    };
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>JazCom Monitor</Text>
        <Button
          onPress={() => this.props.navigation.navigate('Glucose')}
          title="Glucose"
        />
        <Button
          onPress={() => this.props.navigation.navigate('LightSwitches')}
          title="LightSwitches"
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
    color: "#9cf",
  },
});
