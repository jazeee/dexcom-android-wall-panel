import { WrappedPlotView } from './PlotView';

import { PlotViewHeaderButtons } from './Header';

export const plotViewRouteConfig = {
  name: 'PlotView',
  component: WrappedPlotView,
  options: {
    headerRight: () => <PlotViewHeaderButtons />,
  },
};
