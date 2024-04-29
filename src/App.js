/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React from 'react';
import KeepAwake from 'react-native-keep-awake';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import LoadingView from './UserSettings/LoadingView';
import SettingsWrapper from './UserSettings/SettingsWrapper';
import { COLORS } from './common/colors';
import Home from './Home/Home';
import PlotView from './PlotView/PlotView';

const AppNavigator = createStackNavigator(
  {
    Home: { screen: Home },
    LoadingView: { screen: LoadingView },
    PlotView: { screen: PlotView },
  },
  {
    initialRouteName: 'LoadingView',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#000',
      },
      headerTintColor: COLORS.primary,
    },
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    KeepAwake.activate();
  }
  render() {
    return (
      <SettingsWrapper>
        <AppContainer />
      </SettingsWrapper>
    );
  }
}
