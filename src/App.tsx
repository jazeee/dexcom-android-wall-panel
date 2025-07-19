import React from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from 'react-native-error-boundary';
import { SettingsProvider } from './UserSettings/SettingsProvider';
import { AppRoutes } from './AppNavigation/Routes';
import { useKeepAwake } from 'expo-keep-awake';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export function App(): React.JSX.Element {
  const queryClient = new QueryClient();
  useKeepAwake();

  return (
    <>
      <StatusBar barStyle="dark-content" hidden />
      <ErrorBoundary>
        <NavigationContainer>
          <QueryClientProvider client={queryClient}>
            <SettingsProvider>
              <SafeAreaProvider>
                <AppRoutes />
              </SafeAreaProvider>
            </SettingsProvider>
          </QueryClientProvider>
        </NavigationContainer>
      </ErrorBoundary>
    </>
  );
}
