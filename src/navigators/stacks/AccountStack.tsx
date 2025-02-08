import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, type FC } from 'react';

import { AccountScreen } from '@/screens/authenticated/account';
import { RootState } from '@/store/store';
import { type AccountStackParamList, type BottomTabNavigatorScreenProps } from '@/types/navigation';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import LoginScreen from '@/screens/unauthenticated/login/LoginScreen';
import AccountInfoScreen from '@/screens/authenticated/account/AccountInfoScreen';
import ManageAccountScreen from '@/screens/authenticated/account/ManageAccountScreen';

const Stack = createNativeStackNavigator<AccountStackParamList>();

export const AccountStack: FC<BottomTabNavigatorScreenProps<'AccountStack'>> = () => {
    const { accessToken } = useSelector((state: RootState) => state.user);
    const navigation = useNavigation();


    return (
        <Stack.Navigator
            screenOptions={{
                animation: 'slide_from_right',
                animationDuration: 0,
            }}>
            {!accessToken && <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                    headerShown: false,
                }}
            />}
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
        </Stack.Navigator>
    );
};
