import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { COLORS } from '../common/colors';
import SettingsView from '../SettingsView';
import Home from '../Home';
import PlotView from '../PlotView';
import AudioTest from '../PlotView/AudioTest';

const PlotStack = createNativeStackNavigator();
//   {
//     Home: { screen: Home },
//     SettingsView: { screen: SettingsView },
//     PlotView: { screen: PlotView },
//     AudioTest: { screen: AudioTest },
//   },
//   {
//     initialRouteName: 'Home',
//     defaultNavigationOptions: {
//       headerStyle: {
//         backgroundColor: '#000',
//       },
//       headerTintColor: COLORS.primary,
//     },
//   },
// );

function PlotStackNavigator() {
  return (
    <PlotStack.Navigator initialRouteName="Home">
      <PlotStack.Screen name="Home" component={Home} />
      <PlotStack.Screen name="SettingsView" component={SettingsView} />
      <PlotStack.Screen name="PlotView" component={PlotView} />
      <PlotStack.Screen name="AudioTest" component={AudioTest} />
    </PlotStack.Navigator>
  );
}

export default PlotStackNavigator;
