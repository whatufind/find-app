
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { type ReactElement } from 'react';

import { type AuthenticatedStackNavigatorParamList } from '@/types/navigation';

import { BottomTabNavigator } from './BottomTabNavigator';
import ServiceDetails from '@/screens/authenticated/service/ServiceDetails';
import LoginScreen from '@/screens/unauthenticated/login/LoginScreen';

const Stack = createNativeStackNavigator<AuthenticatedStackNavigatorParamList>();

export const AuthenticatedNavigator = (): ReactElement => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Root"
                component={BottomTabNavigator}
                options={{ animation: 'slide_from_bottom' }}
            />

            <Stack.Screen
                name="ServiceDetails"
                component={ServiceDetails}
                options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ animation: 'slide_from_bottom' }}
            />


        </Stack.Navigator>
    );
};

export default AuthenticatedNavigator;
