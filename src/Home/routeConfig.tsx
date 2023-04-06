import { Home } from './Home';

import { HomeHeaderButtons } from './Header';
import { DateTime } from '../common/components/DateTime';

export const homeRouteConfig = {
  name: 'Home',
  component: Home,
  options: {
    headerTitle: () => <DateTime />,
    headerRight: () => <HomeHeaderButtons />,
  },
};
