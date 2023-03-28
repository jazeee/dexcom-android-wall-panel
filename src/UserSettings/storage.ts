import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ISettingProp {
  name: string;
  defaultValue: string;
  value?: string | null;
}

const SETTING_PROPS: ISettingProp[] = [
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

function extractSettingsFromArray(
  settingProps: ISettingProp[],
): Record<string, string> {
  const settings: Record<string, string> = {};
  settingProps.forEach(({ name, value, defaultValue }) => {
    settings[name] = value ?? defaultValue;
  });
  return settings;
}

export const DEFAULT_SETTINGS = extractSettingsFromArray(SETTING_PROPS);

export async function storeSettings(settings: Record<string, string>) {
  const promises = SETTING_PROPS.map(async (prop) => {
    const { name } = prop;
    return await AsyncStorage.setItem(`@jazcom:${name}`, settings[name]);
  });
  return Promise.all(promises);
}

export const loadSettings = async () => {
  const promises = SETTING_PROPS.map(async (prop) => {
    const { name, defaultValue } = prop;
    const value = await AsyncStorage.getItem(`@jazcom:${name}`);
    return { name, value, defaultValue };
  });
  const results = await Promise.all(promises);
  return extractSettingsFromArray(results);
};
