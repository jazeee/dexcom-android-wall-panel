import { AsyncStorage } from 'react-native';

const SETTING_PROPS = [
  {
    name: 'username',
    defaultValue: '',
  },
  {
    name: 'password',
    defaultValue: '',
  },
  {
    name: 'sourceUrl',
    defaultValue: 'https://jazcom.jazeee.com/sample3',
  },
  {
    name: 'initialVisitState',
    defaultValue: 'NEVER_OPENED',
  },
];

export const extractSettingsFromArray = settingProps => {
  const settings = {};
  settingProps.forEach(({ name, value, defaultValue }) => {
    settings[name] = value != null ? value : defaultValue;
  });
  return settings;
};

export const DEFAULT_SETTINGS = extractSettingsFromArray(SETTING_PROPS);

export const saveSettings = async settings => {
  const promises = SETTING_PROPS.map(async prop => {
    const { name } = prop;
    return await AsyncStorage.setItem(`@jazcom:${name}`, settings[name]);
  });
  return Promise.all(promises);
};

export const saveSettingsState = async (state, setState) => {
  await saveSettings(state);
  await setState(state);
};

export const loadSettings = async () => {
  const promises = SETTING_PROPS.map(async prop => {
    const { name, defaultValue } = prop;
    const value = await AsyncStorage.getItem(`@jazcom:${name}`);
    return { name, value, defaultValue };
  });
  const results = await Promise.all(promises);
  return extractSettingsFromArray(results);
};
