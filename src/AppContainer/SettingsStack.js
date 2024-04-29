import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { COLORS } from '../common/colors';
import SettingsView from '../SettingsView';
import Home from '../Home';

const SettingsStack = createNativeStackNavigator();
//   {
//     Home: { screen: Home },
//     SettingsView: { screen: SettingsView },
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

const SettingsStackNavigator = () => {
  <SettingsStack.Navigator initialRouteName="Home">
    <SettingsStack.Screen name="Home" component={Home} />
    <SettingsStack.Screen name="SettingsView" component={SettingsView} />
  </SettingsStack.Navigator>;
};

export default SettingsStackNavigator;
