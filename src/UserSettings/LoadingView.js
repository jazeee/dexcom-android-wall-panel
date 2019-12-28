import React from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';

import { loadSettings } from './storage';
import { SettingsConsumer } from './context';

class LoadingView extends React.Component {
  componentDidMount() {
    this.initiateLoad();
  }

  initiateLoad = async () => {
    try {
      const settings = await loadSettings();
      this.props.setState(settings);
      this.props.navigation.navigate(settings.username ? 'PlotView' : 'Home');
    } catch (error) {
      console.debug('Error in loading settings', error);
    }
  };

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default props => {
  return (
    <SettingsConsumer>
      {({ setState }) => <LoadingView {...props} setState={setState} />}
    </SettingsConsumer>
  );
};
