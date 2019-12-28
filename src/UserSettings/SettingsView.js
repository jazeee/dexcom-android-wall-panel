import React, { Component } from 'react';
import { View, TextInput, Button } from 'react-native';

import { SettingsConsumer } from './context';
import { saveSettings } from './storage';

class SettingsView extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props.state };
  }

  onAccept = async () => {
    await saveSettings(this.state);
    await this.props.setState(this.state);
    this.props.navigation.navigate('PlotView');
  };
  render() {
    const { username, password } = this.state;
    return (
      <View>
        <TextInput
          placeholder="Username"
          value={username}
          autoCapitalize="none"
          autoComplete="username"
          autoCorrect={false}
          autoFocus
          onChangeText={username => this.setState({ username })}
        />
        <TextInput
          placeholder="Password"
          value={password}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry
          onChangeText={password => this.setState({ password })}
        />
        <Button onPress={this.onAccept} title="Accept" />
      </View>
    );
  }
}

export default props => {
  return (
    <SettingsConsumer>
      {({ state, setState }) => (
        <SettingsView {...props} setState={setState} state={state} />
      )}
    </SettingsConsumer>
  );
};
