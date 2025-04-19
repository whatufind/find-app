import React, { type ReactElement } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthStore } from '@/hooks/store/useAuthStore';
import { type NavigationProps, type RootNavigatorParamList } from '@/types/navigation';

import { AuthenticatedNavigator } from './AuthenticatedNavigator';
import { UnAuthenticatedNavigator } from './UnAuthenticatedNavigator';
import { navigationRef } from '@/utils/navigationHelper';
import AccountDrawerNavigator from './drawers/AccountDrawerNavigator';

export const Stack = createNativeStackNavigator<RootNavigatorParamList>();

export const Navigator = (props: NavigationProps): ReactElement => {

    const linking = {
        prefixes: ['whatufind://', 'http://173.249.59.88/v1'],
        config: {
          screens: {
            AuthenticatedStack: {
              screens: {
                ServiceDetails: 'servicedetails/:id',
              },
            },
            UnAuthenticatedStack: {
              screens: {
                Login: 'login',
              },
            },
          },
        },
      };


    return (
        <NavigationContainer
        linking={linking}
        ref={navigationRef}
            {...props}

        //To do : implement bootsplash for splash screen
        // onReady={() => {
        //     void BootSplash.hide({ fade: true });
        // }}
        >
            <Stack.Navigator screenOptions={{ headerShown: false }}>

                    <Stack.Screen name="AuthenticatedStack" component={AuthenticatedNavigator} />
                    <Stack.Screen name="UnAuthenticatedStack" component={UnAuthenticatedNavigator} />
                    <Stack.Screen name="AccountDrawer" component={AccountDrawerNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigator;
