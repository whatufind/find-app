import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { type FC } from 'react';

import CommunityScreen from '@/screens/community/CommunityScreen';
import { type BottomTabNavigatorScreenProps, type CommunityStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<CommunityStackParamList>();

export const CommunityStack: FC<BottomTabNavigatorScreenProps<'CommunityStack'>> = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                animation: 'slide_from_right',
                animationDuration: 0,
            }}>
            <Stack.Screen
                name="Community"
                component={CommunityScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};
