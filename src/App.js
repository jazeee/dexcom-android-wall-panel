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
import AppContainer from './AppContainer';
import ErrorBoundary from 'react-native-error-boundary';
import 'react-native-gesture-handler';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    KeepAwake.activate();
  }
  render() {
    return (
      <ErrorBoundary>
        <SettingsState>
          <AppContainer />
        </SettingsState>
      </ErrorBoundary>
    );
  }
}
