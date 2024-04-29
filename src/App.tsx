import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { SettingsProvider } from './UserSettings/SettingsProvider';
import ErrorBoundary from 'react-native-error-boundary';
import { AppRoutes } from './AppNavigation/Routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

export function App(): JSX.Element {
  return (
    <ErrorBoundary>
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
