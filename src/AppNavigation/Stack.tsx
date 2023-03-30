import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PropsWithChildren } from 'react';
import { COLORS } from '../common/colors';
import { homeRouteConfig } from '../Home';
import { plotViewRouteConfig } from '../PlotView/routeConfig';
import { useSettingsContext } from '../UserSettings/SettingsProvider';

export const AppStack = createNativeStackNavigator();

const headerOptions = {
  headerStyle: {
    backgroundColor: '#000',
  },
  headerTintColor: COLORS.primary,
};

export function AppStackNavigator(props: PropsWithChildren) {
  const { children } = props;
  const { settingsHaveBeenUpdated } = useSettingsContext();
  return (
    <AppStack.Navigator
      initialRouteName={
        settingsHaveBeenUpdated
          ? plotViewRouteConfig.name
          : homeRouteConfig.name
      }
      screenOptions={headerOptions}>
      {children}
    </AppStack.Navigator>
  );
}
