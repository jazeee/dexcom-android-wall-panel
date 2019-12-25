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

import { COLORS } from './src/common/colors';
import Home from './src/Home/Home';
import PlotView from './src/PlotView/PlotView';

const AppNavigator = createStackNavigator(
  {
    Home: { screen: Home },
    PlotView: { screen: PlotView },
  },
  {
    initialRouteName: 'PlotView',
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
    return <AppContainer />;
  }
}
