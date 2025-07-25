import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import { COLORS } from '../common/colors';
import { FormTextInput } from './components/FormTextInput';
import { SourceUrlPicker } from './components/SourceUrlPicker';
import { isTestApi } from '../UserSettings/utils';

import { storeSettings } from '../UserSettings/storage';
import { useSettingsContext } from '../UserSettings/SettingsProvider';
import { useNavigation } from '@react-navigation/native';
import { SettingName, SettingsStatus } from '../UserSettings/types';
import { InsetView } from '../common/components/InsetView';

export function SettingsView() {
  const { settings, reloadSettings } = useSettingsContext();
  const [localSettings, setLocalSettings] =
    useState<Record<SettingName, string>>(settings);
  const { username, password, sourceUrl } = localSettings;
  const { navigate } = useNavigation();

  async function onAccept() {
    storeSettings({
      ...localSettings,
      [SettingName.SETTINGS_STATE]: SettingsStatus.UPDATED,
    });
    await reloadSettings();
    navigate('PlotView' as never);
  }

  const usingTestApi = isTestApi(sourceUrl);
  return (
    <InsetView style={styles.form}>
      <Text style={styles.header}>Source</Text>
      <View style={{ ...styles.formField, ...styles.urlFormField }}>
        <Text style={styles.label}>Data Source:</Text>
        <SourceUrlPicker
          sourceUrl={sourceUrl}
          setSourceUrl={(newUrl) => {
            setLocalSettings((currentState) => ({
              ...currentState,
              sourceUrl: newUrl,
            }));
          }}
        />
      </View>
      {!usingTestApi && (
        <>
          <Text style={styles.header}>Account</Text>
          <View style={styles.formField}>
            <Text style={styles.label}>User Name:</Text>
            <FormTextInput
              placeholder="Username"
              value={username}
              autoComplete="username"
              setValue={(newUsername) => {
                setLocalSettings((currentState) => ({
                  ...currentState,
                  username: newUsername,
                }));
              }}
            />
          </View>
          <View style={styles.formField}>
            <Text style={styles.label}>Password: </Text>
            <FormTextInput
              placeholder="Password"
              value={password}
              autoComplete="password"
              secureTextEntry
              setValue={(newPassword) => {
                setLocalSettings((currentState) => ({
                  ...currentState,
                  password: newPassword,
                }));
              }}
            />
          </View>
        </>
      )}
      <Button onPress={onAccept} title="Accept" />
    </InsetView>
  );
}

const styles = StyleSheet.create({
  form: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000',
  },
  header: {
    fontSize: 32,
    color: COLORS.primary,
    textAlign: 'center',
  },
  urlFormField: {
    height: 48,
  },
  formField: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    padding: 'auto',
    fontSize: 16,
    width: '40%',
    textAlign: 'right',
    color: COLORS.primary,
  },
});
