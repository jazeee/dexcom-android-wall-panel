import React from 'react';

import { DEFAULT_SETTINGS, loadSettings } from './storage';
import { SettingsProvider } from './context';

class SettingsWrapper extends React.Component {
  state = {
    ...DEFAULT_SETTINGS,
    isInitialized: false,
  };

  componentDidMount() {
    this.initiateLoad();
  }

  initiateLoad = async () => {
    try {
      const settings = await loadSettings();
      this.setState({ ...settings, isInitialized: true });
    } catch (error) {
      console.debug('Error in loading settings', error);
    }
  };

  render() {
    const { children } = this.props;
    const { isInitialized } = this.state;
    return (
      <SettingsProvider
        value={{
          state: this.state,
          setState: state =>
            new Promise(resolve => this.setState(state, resolve)),
        }}>
        {isInitialized ? children : null}
      </SettingsProvider>
    );
  }
}

export default SettingsWrapper;
