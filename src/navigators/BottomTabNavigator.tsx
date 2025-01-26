/* eslint-disable react/no-unstable-nested-components */
import {
    type BottomTabNavigationOptions,
    createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { type RouteProp } from '@react-navigation/native';
import React, { type FC, type ReactElement } from 'react';
import { type TextStyle, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import theme from '@/theme';
import {
    type AuthenticatedStackNavigatorScreenProps,
    type BottomTabNavigatorParamList,
} from '@/types/navigation';

import { IconButton } from '@/components';
import { FeedStack } from './stacks/FeedStack';
import { HomeStack } from './stacks/HomeStack';
import { CommunityStack } from './stacks/CommuniityStack';
import { AccountStack } from './stacks/AccountStack';

const BottomTabIcon = ({
    focused,
    title,
}: {
    title: string;
    focused: boolean;
    color: string;
    size: number;
}): ReactElement => {
    console.log(title);
    return (
        <IconButton

            variant="vector"
            type={title === 'CommunityStack' ? 'ionicon' : 'materialCommunity'}
            {...(focused && { iconStyle: 'contained' })}
            icon={title === 'ChatStack' ? 'chat' : title === 'CommunityStack' ? 'people' : title === 'AccountStack' ? 'account' : 'home'}
            color={focused ? 'primary' : 'secondary'}
            size={8}
        />
    );
};

const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

interface BottomTabNavigatorProps extends AuthenticatedStackNavigatorScreenProps<'Root'> { }

export const BottomTabNavigator: FC<BottomTabNavigatorProps> = (): ReactElement => {
    const { bottom } = useSafeAreaInsets();

    const screenOptions = ({
        route,
    }: {
        route: RouteProp<BottomTabNavigatorParamList, keyof BottomTabNavigatorParamList>;
    }): BottomTabNavigationOptions => ({
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarActiveTintColor: theme.colors.black900,
        tabBarShowLabel: false,
        headerShadowVisible: false,
        tabBarStyle: [$tabBar, { height: 64 + bottom }],
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
        tabBarIcon: props => <BottomTabIcon {...props} title={route.name} />,
    });

    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen
                name="HomeStack"
                component={HomeStack}
                options={{
                    title: 'Home',
                }}
            />
            <Tab.Screen
                name="CommunityStack"
                component={CommunityStack}
                options={{
                    title: 'Community',
                }}
            />
            <Tab.Screen
                name="ChatStack"
                component={FeedStack}
                options={{
                    title: 'Chats',
                }}
            />
            <Tab.Screen
                name="AccountStack"
                component={AccountStack}
                options={{
                    title: 'Account',
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;

const $tabBar: ViewStyle = {
    // borderTopLeftRadius: 24,
    // borderTopRightRadius: 24
};

const $tabBarItem: ViewStyle = {
    paddingTop: theme.spacing[4],
};

const { b5semiBold } = theme.textVariants;

const $tabBarLabel: TextStyle = {
    fontFamily: b5semiBold.fontFamily,
    fontSize: b5semiBold.fontSize,
    paddingBottom: 6,
};
