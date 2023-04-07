import { PlotViewHeaderButtons } from './Header';
import { DateTime } from '../common/components/DateTime';
import { PlotViewContainer } from './Container';

export const plotViewRouteConfig = {
  name: 'PlotView',
  component: PlotViewContainer,
  options: {
    headerTitle: () => <DateTime />,
    headerRight: () => <PlotViewHeaderButtons />,
  },
};
