/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { SettingsProvider } from './UserSettings/SettingsProvider';
import AppContainer from './AppContainer';
import ErrorBoundary from 'react-native-error-boundary';

export function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <NavigationContainer>
        <SettingsProvider>
          <AppContainer />
        </SettingsProvider>
      </NavigationContainer>
    </ErrorBoundary>
  );
}
