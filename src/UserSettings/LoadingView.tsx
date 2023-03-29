import React, { useEffect } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';

import { loadSettings } from './storage';
import { useSettingsContext } from './SettingsProvider';

export function LoadingView() {
  const { setSettings } = useSettingsContext();
  useEffect(() => {
    async function initiateLoad() {
      try {
        const settings = await loadSettings();
        setSettings(settings);
        // this.props.navigation.navigate(settings.username ? 'PlotView' : 'Home');
      } catch (error) {
        console.debug('Error in loading settings', error);
      }
    }
    initiateLoad();
  }, [setSettings]);

  return (
    <View>
      <ActivityIndicator />
      <StatusBar barStyle="default" />
    </View>
  );
}

export default LoadingView;
