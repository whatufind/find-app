import React, { type FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FeedScreen } from '@/screens/authenticated/feed';
import { type BottomTabNavigatorScreenProps, type FeedStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<FeedStackParamList>();

export const FeedStack: FC<BottomTabNavigatorScreenProps<'ChatStack'>> = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                animation: 'slide_from_right',
                animationDuration: 0,
            }}>
            <Stack.Screen
                name="Feed"
                component={FeedScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};
