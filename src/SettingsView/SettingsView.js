import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import { COLORS } from '../common/colors';
import FormTextInput from './components/FormTextInput';
import SourceUrlPicker from './components/SourceUrlPicker';
import { isTestApi } from '../UserSettings/utils';

import { storeSettings } from '../UserSettings/storage';
import { VISITED_SETTINGS_VIEW } from './constants';

class SettingsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.state,
    };
  }

  componentDidMount() {
    const { state, setState } = this.props;
    const settings = { ...state, initialVisitState: VISITED_SETTINGS_VIEW };
    storeSettings(settings);
    setState(settings);
  }

  onAccept = async () => {
    const { state, setState } = this.props;
    storeSettings(state);
    setState(state);
    this.props.navigation.navigate('PlotView');
  };

  render() {
    const { username, password, sourceUrl } = this.state;
    const usingTestApi = isTestApi(sourceUrl);
    return (
      <View style={styles.form}>
        <Text style={styles.header}>Source</Text>
        <View style={styles.formField}>
          <Text style={styles.label}>Data Source:</Text>
          <SourceUrlPicker
            sourceUrl={sourceUrl}
            setSourceUrl={(sourceUrl) => this.setState({ sourceUrl })}
          />
        </View>
        {!usingTestApi && (
          <>
            <Text style={styles.header}>Account</Text>
            <View style={styles.formField}>
              <Text style={styles.label}>User Name:</Text>
              <FormTextInput
                placeholder="Username"
                value={username}
                autoComplete="username"
                setValue={(username) => this.setState({ username })}
              />
            </View>
            <View style={styles.formField}>
              <Text style={styles.label}>Password: </Text>
              <FormTextInput
                placeholder="Password"
                value={password}
                autoComplete="password"
                secureTextEntry
                setValue={(password) => this.setState({ password })}
              />
            </View>
          </>
        )}
        <Button onPress={this.onAccept} title="Accept" />
      </View>
    );
  }
}

export default SettingsView;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    fontSize: 32,
    color: COLORS.primary,
    textAlign: 'center',
  },
  formField: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    padding: 'auto',
    fontSize: 16,
    width: '40%',
    textAlign: 'right',
    color: COLORS.primary,
  },
});
