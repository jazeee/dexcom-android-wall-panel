/**
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React from 'react';
import KeepAwake from 'react-native-keep-awake';
import SettingsState from './UserSettings/SettingsState';
import PlotStack from './AppContainer/PlotStack';
import 'react-native-gesture-handler';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    KeepAwake.activate();
  }
  render() {
    return (
      <SettingsState>
        <PlotStack />
      </SettingsState>
    );
  }
}
