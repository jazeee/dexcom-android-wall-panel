import React, { ReactNode, useEffect, useState } from 'react';

import { DEFAULT_SETTINGS, loadSettings } from './storage';
import { SettingsProvider } from './context';

interface Props {
  children: ReactNode;
}

export function SettingsState(props: Props) {
  const { children } = props;
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

  return (
    <SettingsProvider
      value={{
        state: settings,
        setState: (newSettings) =>
          new Promise((resolve) => {
            setSettings(newSettings);
            resolve(newSettings);
          }),
      }}>
      {settingsAreLoaded ? children : null}
    </SettingsProvider>
  );
}
