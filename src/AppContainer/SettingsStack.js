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
import SettingsView from '../SettingsView';
import Home from '../Home';

const SettingsNavigator = createStackNavigator(
  {
    Home: { screen: Home },
    SettingsView: { screen: SettingsView },
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#000',
      },
      headerTintColor: COLORS.primary,
    },
  },
);

const SettingsStack = createAppContainer(SettingsNavigator);

export default SettingsStack;
