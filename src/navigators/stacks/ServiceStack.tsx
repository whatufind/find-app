import React, { type FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ServiceScreen } from '@/screens/authenticated/service';
import { type BottomTabNavigatorScreenProps, type ServiceStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<ServiceStackParamList>();

export const ServiceStack: FC<BottomTabNavigatorScreenProps<'ServiceStack'>> = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                animation: 'slide_from_right',
                animationDuration: 0,
            }}>
            <Stack.Screen
                name="Service"
                component={ServiceScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};
