import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PropsWithChildren } from 'react';
import { COLORS } from '../common/colors';

export const AppStack = createNativeStackNavigator();

const headerOptions = {
  headerStyle: {
    backgroundColor: '#000',
  },
  headerTintColor: COLORS.primary,
};

export function AppStackNavigator(props: PropsWithChildren) {
  const { children } = props;
  return (
    <AppStack.Navigator initialRouteName="Home" screenOptions={headerOptions}>
      {children}
    </AppStack.Navigator>
  );
}
