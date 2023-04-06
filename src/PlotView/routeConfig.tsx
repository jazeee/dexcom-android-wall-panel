import { WrappedPlotView } from './PlotView';

import { PlotViewHeaderButtons } from './Header';
import { DateTime } from '../common/components/DateTime';

export const plotViewRouteConfig = {
  name: 'PlotView',
  component: WrappedPlotView,
  options: {
    headerTitle: () => <DateTime />,
    headerRight: () => <PlotViewHeaderButtons />,
  },
};
