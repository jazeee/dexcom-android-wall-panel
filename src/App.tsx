import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import KeepAwake from 'react-native-keep-awake';

import { SettingsProvider } from './UserSettings/SettingsProvider';
import ErrorBoundary from 'react-native-error-boundary';
import { AppRoutes } from './AppNavigation/Routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'react-native';
const queryClient = new QueryClient();

export function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <KeepAwake />
      <StatusBar barStyle="dark-content" hidden />
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          <NavigationContainer>
            <AppRoutes />
          </NavigationContainer>
        </SettingsProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
