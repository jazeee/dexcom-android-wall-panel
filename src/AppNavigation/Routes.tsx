import { settingsRouteConfig } from '../SettingsView';
import { homeRouteConfig } from '../Home';
import PlotView from '../PlotView';
import AudioTest from '../PlotView/AudioTest';
import { AppStack, AppStackNavigator } from './Stack';

export function AppRoutes() {
  return (
    <AppStackNavigator>
      <AppStack.Screen {...homeRouteConfig} />
      <AppStack.Screen {...settingsRouteConfig} />
      <AppStack.Screen name="PlotView" component={PlotView} />
      <AppStack.Screen name="AudioTest" component={AudioTest} />
    </AppStackNavigator>
  );
}
