import { settingsRouteConfig } from '../SettingsView';
import { homeRouteConfig } from '../Home';
import { AppStack, AppStackNavigator } from './Stack';
import { audioTestRouteConfig } from '../AudioTest/routeConfig';
import { plotViewRouteConfig } from '../PlotView/routeConfig';
import { useSettingsContext } from '../UserSettings/SettingsProvider';
import { LoadingView } from './LoadingView';

export function AppRoutes() {
  const { settingsAreLoading } = useSettingsContext();
  if (settingsAreLoading) {
    return <LoadingView />;
  }
  return (
    <AppStackNavigator>
      <AppStack.Screen {...homeRouteConfig} />
      <AppStack.Screen {...settingsRouteConfig} />
      <AppStack.Screen {...plotViewRouteConfig} />
      <AppStack.Screen {...audioTestRouteConfig} />
    </AppStackNavigator>
  );
}
