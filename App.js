/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import Home from './src/Home/Home.js';
import PlotView from './src/PlotView/PlotView.js';
import { createStackNavigator, createAppContainer } from "react-navigation";

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const AppNavigator = createStackNavigator({
  Home,
  PlotView,
}, {
  initialRouteName: "PlotView",
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#000',
    },
    headerTintColor: '#841584',
  },
});

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
