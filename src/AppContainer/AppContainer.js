// /**
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow
//  * @lint-ignore-every XPLATJSCOPYRIGHT1
//  */
//
// import { createAppContainer, createSwitchNavigator } from 'react-navigation';
//
// import { COLORS } from '../common/colors';
// import LoadingView from '../UserSettings/LoadingView';
// import SettingsStack from './SettingsStack';
// import PlotStack from './PlotStack';
//
// const AppNavigator = createSwitchNavigator(
//   {
//     LoadingView,
//     PlotStack,
//     SettingsStack,
//   },
//   {
//     initialRouteName: 'LoadingView',
//     defaultNavigationOptions: {
//       headerStyle: {
//         backgroundColor: '#000',
//       },
//       headerTintColor: COLORS.primary,
//     },
//   },
// );
//
// const AppContainer = createAppContainer(AppNavigator);
//
// export default AppContainer;
