/**
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { COLORS } from '../common/colors';
import SettingsView from '../UserSettings/SettingsView';
import Home from '../Home/Home';
import PlotView from '../PlotView/PlotView';

const PlotStackNavigator = createStackNavigator(
  {
    Home: { screen: Home },
    SettingsView: { screen: SettingsView },
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

const PlotStack = createAppContainer(PlotStackNavigator);

export default PlotStack;
