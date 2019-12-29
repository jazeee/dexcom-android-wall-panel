import React from 'react';
import { StyleSheet } from 'react-native';

import { SettingsConsumer } from '../UserSettings/context';
import DateTime from '../common/components/DateTime';

export const generateViewContainer = ({ View, Header }) => {
  const SettingsViewContainer = props => {
    return (
      <SettingsConsumer>
        {({ setState, state }) => (
          <View {...props} setState={setState} state={state} />
        )}
      </SettingsConsumer>
    );
  };

  SettingsViewContainer.navigationOptions = ({ navigation, screenProps }) => {
    return {
      headerTitle: () => (
        <>
          <DateTime style={styles.dateTime} />
        </>
      ),
      headerRight: <Header navigation={navigation} />,
    };
  };

  const styles = StyleSheet.create({});
  return SettingsViewContainer;
};
