import constate from 'constate';

import { useEffect, useState } from 'react';

import { DEFAULT_SETTINGS, loadSettings } from './storage';

function useSettings() {
  const [settings, setSettings] =
    useState<Record<string, string>>(DEFAULT_SETTINGS);
  const [settingsAreLoaded, setSettingsAreLoaded] = useState(false);

  useEffect(() => {
    loadSettings()
      .then((newSettings) => {
        setSettings(newSettings);
        setSettingsAreLoaded(true);
      })
      .catch((error) => {
        console.debug('Error in loading settings', error);
      });
  }, []);

  return {
    settings,
    setSettings,
    settingsAreLoaded,
  };
}

export const [SettingsProvider, useSettingsContext] = constate(useSettings);
