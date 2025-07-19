import { useQuery } from '@tanstack/react-query';
import constate from 'constate';

import { DEFAULT_SETTINGS, loadSettings } from './storage';
import { SettingName, SettingsStatus } from './types';

function useSettings() {
  const settingsQuery = useQuery({
    queryKey: ['async-settings'],
    queryFn: loadSettings,
  });
  const {
    data: settings,
    isLoading: settingsAreLoading,
    refetch,
  } = settingsQuery;

  const settingsHaveBeenUpdated =
    settings?.[SettingName.SETTINGS_STATE] === SettingsStatus.UPDATED;

  return {
    settings: settings ?? DEFAULT_SETTINGS,
    settingsHaveBeenUpdated,
    settingsAreSet: Boolean(settings),
    settingsAreLoading,
    reloadSettings: refetch,
    settingsQuery,
  };
}

export const [SettingsProvider, useSettingsContext] = constate(useSettings);
