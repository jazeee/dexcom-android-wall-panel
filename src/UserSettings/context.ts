import React from 'react';
import { DEFAULT_SETTINGS } from './storage';

export const SettingsContext = React.createContext({
  state: DEFAULT_SETTINGS,
  setState: (_newState: Record<string, string>) => {},
});

export const SettingsProvider = SettingsContext.Provider;
export const SettingsConsumer = SettingsContext.Consumer;
