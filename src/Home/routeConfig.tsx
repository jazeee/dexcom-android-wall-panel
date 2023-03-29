import { Home } from './Home';

import { HomeHeaderButtons } from './Header';

export const homeRouteConfig = {
  name: 'Home',
  component: Home,
  options: {
    headerRight: () => <HomeHeaderButtons />,
  },
};
