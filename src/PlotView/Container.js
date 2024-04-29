import PlotView from './PlotView';
import Header from './Header';
import { generateViewContainer } from '../UserSettings/Container';

const PlotViewContainer = generateViewContainer({ View: PlotView, Header });

export default PlotViewContainer;
