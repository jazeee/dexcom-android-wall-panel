import { PlotView } from './PlotView';

import { PlotViewHeaderButtons } from './Header';
import { DateTime } from '../common/components/DateTime';

export const plotViewRouteConfig = {
  name: 'PlotView',
  component: PlotView,
  options: {
    headerTitle: () => <DateTime />,
    headerRight: () => <PlotViewHeaderButtons />,
  },
};
