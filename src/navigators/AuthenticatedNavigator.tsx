
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { type ReactElement } from 'react';

import { type AuthenticatedStackNavigatorParamList } from '@/types/navigation';

import { BottomTabNavigator } from './BottomTabNavigator';
import ServiceDetails from '@/screens/authenticated/service/ServiceDetails';
import LoginScreen from '@/screens/unauthenticated/login/LoginScreen';
import RegisterScreen from '@/screens/unauthenticated/login/RegisterScreen';
import ReqestersScreen from '@/screens/authenticated/request/ReqestersScreen';
import PublicProfileScreen from '@/screens/authenticated/public/PublicProfileScreen';
import ChatScreen from '@/screens/authenticated/chat/ChatScreen';

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
                name="Register"
                component={RegisterScreen}
            />

            <Stack.Screen
                name="ServiceDetails"
                component={ServiceDetails}
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ animation: 'fade' }}
            />
            <Stack.Screen
                name="Requesters"
                component={ReqestersScreen}
                options={{ animation: 'fade' }}
            />
            <Stack.Screen
                name="Public Profile"
                component={PublicProfileScreen}
                options={{ animation: 'fade' }}
            />
            <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={{ animation: 'fade' }}
            />


        </Stack.Navigator>
    );
};

export default AuthenticatedNavigator;
