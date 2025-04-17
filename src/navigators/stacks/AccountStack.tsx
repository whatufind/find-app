import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { type FC } from 'react';

import { AccountScreen } from '@/screens/authenticated/account';
import AccountInfoScreen from '@/screens/authenticated/account/AccountInfoScreen';
import ChangePasswordScreen from '@/screens/authenticated/account/ChangePasswordScreen';
import ManageAccountScreen from '@/screens/authenticated/account/ManageAccountScreen';
import { type AccountStackParamList, type BottomTabNavigatorScreenProps } from '@/types/navigation';

const Stack = createNativeStackNavigator<AccountStackParamList>();

export const AccountStack: FC<BottomTabNavigatorScreenProps<'AccountStack'>> = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                animation: 'slide_from_right',
                animationDuration: 0,
            }}>
            <Stack.Screen
                name="Profile"
                component={AccountScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Account Info"
                component={AccountInfoScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Manage Account"
                component={ManageAccountScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Change Password"
                component={ChangePasswordScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};
