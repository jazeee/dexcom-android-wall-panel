import Home from './Home';
import Header from './Header';
import { generateViewContainer } from '../UserSettings/Container';

const HomeContainer = generateViewContainer({ View: Home, Header });

export default HomeContainer;
