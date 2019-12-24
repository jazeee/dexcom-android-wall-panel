/**
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Dialog from "react-native-dialog";

type Props = {
  username: string,
  password: string,
  setCreds: (string, string) => any,
  isSetupDialogVisible: boolean,
  setIsSetupDialogVisible: (boolean) => any,
};

type State = {
  username: string,
  password: string,
}

export class JazComAccountDialog extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username || "",
      password: props.password || "",
    };
  }

  onAccept = () => {
    this.props.setIsSetupDialogVisible(false);
    const { username, password } = this.state;
    this.props.setCreds(username, password);
  }
  render () {
    const { isSetupDialogVisible } = this.props;
    const { username, password } = this.state;
    return (
      <View>
        <Dialog.Container visible={isSetupDialogVisible}>
          <Dialog.Title>Account</Dialog.Title>
          <Dialog.Description>
            Enter Credentials.
          </Dialog.Description>
          <Dialog.Input
            placeholder="Username"
            value={username}
            autoCapitalize="none"
            autoComplete="username"
            autoCorrect={false}
            autoFocus
            onChangeText={(username) => this.setState({ username })}
          />
          <Dialog.Input
            placeholder="Password"
            value={password}
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect={false}
            secureTextEntry
            onChangeText={(password) => this.setState({ password })}
          />
          <Dialog.Button
            onPress={() => this.props.setIsSetupDialogVisible(false)}
            label="Cancel"
          />
          <Dialog.Button
            onPress={this.onAccept}
            label="Accept"
          />
        </Dialog.Container>
      </View>
    )
  }
}
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#002',
//   },
//   value: {
//     fontSize: 160,
//     color: "#841584",
//   },
// });
