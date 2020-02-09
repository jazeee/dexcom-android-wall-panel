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
import PlotView from '../PlotView';
import AudioTest from '../PlotView/AudioTest';

const PlotStackNavigator = createStackNavigator(
  {
    Home: { screen: Home },
    SettingsView: { screen: SettingsView },
    PlotView: { screen: PlotView },
    AudioTest: { screen: AudioTest },
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

const PlotStack = createAppContainer(PlotStackNavigator);

export default PlotStack;
