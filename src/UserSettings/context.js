import React from 'react';
import { DEFAULT_SETTINGS } from './storage';

export const SettingsContext = React.createContext(DEFAULT_SETTINGS);

export const SettingsProvider = SettingsContext.Provider;
export const SettingsConsumer = SettingsContext.Consumer;
