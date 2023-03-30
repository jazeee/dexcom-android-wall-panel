import { settingsRouteConfig } from '../SettingsView';
import { homeRouteConfig } from '../Home';
import { AppStack, AppStackNavigator } from './Stack';
import { audioTestRouteConfig } from '../AudioTest/routeConfig';
import { plotViewRouteConfig } from '../PlotView/routeConfig';

export function AppRoutes() {
  return (
    <AppStackNavigator>
      <AppStack.Screen {...homeRouteConfig} />
      <AppStack.Screen {...settingsRouteConfig} />
      <AppStack.Screen {...plotViewRouteConfig} />
      <AppStack.Screen {...audioTestRouteConfig} />
    </AppStackNavigator>
  );
}
