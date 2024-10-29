import React, { type ReactElement } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthStore } from '@/hooks/store/useAuthStore';
import { type NavigationProps, type RootNavigatorParamList } from '@/types/navigation';

import { AuthenticatedNavigator } from './AuthenticatedNavigator';
import { UnAuthenticatedNavigator } from './UnAuthenticatedNavigator';

export const Stack = createNativeStackNavigator<RootNavigatorParamList>();

export const Navigator = (props: NavigationProps): ReactElement => {
    const { isLoggedIn } = useAuthStore();

    return (
        <NavigationContainer
            {...props}

        //To do : implement bootsplash for splash screen
        // onReady={() => {
        //     void BootSplash.hide({ fade: true });
        // }}
        >
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isLoggedIn ? (
                    <Stack.Screen name="AuthenticatedStack" component={AuthenticatedNavigator} />
                ) : (
                    <Stack.Screen name="UnAuthenticatedStack" component={UnAuthenticatedNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigator;
