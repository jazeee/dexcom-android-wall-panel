import React from 'react';
import KeepAwake from 'react-native-keep-awake';
import SettingsState from './UserSettings/SettingsState';
import AppContainer from './AppContainer';
import ErrorBoundary from 'react-native-error-boundary';
// import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    KeepAwake.activate();
  }
  render() {
    return (
      <ErrorBoundary>
        <SettingsState>
          <NavigationContainer>
            <View>
              <Text>Test</Text>
            </View>
            {/* <AppContainer /> */}
          </NavigationContainer>
        </SettingsState>
      </ErrorBoundary>
    );
  }
}
