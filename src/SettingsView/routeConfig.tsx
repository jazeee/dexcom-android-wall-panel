import { SettingsView } from './SettingsView';

import { SettingsHeaderButtons } from './Header';

export const settingsRouteConfig = {
  name: 'SettingsView',
  component: SettingsView,
  options: {
    headerRight: () => <SettingsHeaderButtons />,
  },
};
