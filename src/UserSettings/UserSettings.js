import React from 'react';

import { DEFAULT_SETTINGS } from './storage';
import { SettingsProvider } from './context';

class UserSettings extends React.Component {
  state = {
    ...DEFAULT_SETTINGS,
  };

  render() {
    const { children } = this.props;
    return (
      <SettingsProvider
        value={{
          ...this.state,
          setState: state => this.setState(state),
        }}>
        {children}
      </SettingsProvider>
    );
  }
}

export default UserSettings;
