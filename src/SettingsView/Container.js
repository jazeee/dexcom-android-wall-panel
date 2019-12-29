import SettingsView from './SettingsView';
import Header from './Header';
import { generateViewContainer } from '../UserSettings/Container';

const Container = generateViewContainer({ View: SettingsView, Header });

export default Container;
