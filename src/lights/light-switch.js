/**
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';

type Props = {
  switchId: number,
};

type State = {
  response: string,
}

export class LightSwitch extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      response: "test",
    };
  }

  toggleSwitch = async (switchId) => {
    try {
      const postResult = await fetch(`http://10.2.1.${switchId}/toggle-relay`, {
        method: "POST",
      });
      const { status } = postResult;
      if (status !== 200) {
        throw new Error("Unable to Post");
      }
      // const response = await postResult.text();
      // this.setState({ response });
    } catch (error) {
      console.log(error);
      this.setState({ response: error.toString() });
    };
  }
  render() {
    const { switchId } = this.props;
    const { response } = this.state;
    return (
      <View style={styles.container}>
        <Button
          onPress={this.toggleSwitch.bind(this, switchId)}
          title={`Toggle ${switchId}`}
          color="#841584"
          accessibilityLabel="Toggle Switch"
        />
        <Text style={styles.response}>{response}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#444',
  },
  response: {
    color: "#f00",
  },
});
