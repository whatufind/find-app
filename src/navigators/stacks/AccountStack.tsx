import React, { type FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FeedScreen } from '@/screens/authenticated/feed';
import { type BottomTabNavigatorScreenProps, type AccountStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<AccountStackParamList>();

export const Account: FC<BottomTabNavigatorScreenProps<'AccountStack'>> = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                animation: 'slide_from_right',
                animationDuration: 0,
            }}>
            <Stack.Screen
                name="Account"
                component={FeedScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};
