import React, { type FC, type ReactElement } from 'react';
import { type TextStyle, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    type BottomTabNavigationOptions,
    createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { type RouteProp } from '@react-navigation/native';

import theme from '@/theme';
import {
    type AuthenticatedStackNavigatorScreenProps,
    type BottomTabNavigatorParamList,
} from '@/types/navigation';
import { useStringHelper } from '@/utils';

import { HomeStack } from './stacks/HomeStack';
import { FeedStack } from './stacks/FeedStack';
import { ServiceStack } from './stacks/ServiceStack';
import { Accountscreen } from '@/screens/authenticated/account';

// const BottomTabIcon = ({
//     focused,
//     title,
// }: {
//     title: string;
//     focused: boolean;
//     color: string;
//     size: number;
// }): ReactElement => {
//     const { camelize } = useStringHelper();
//     return (
//         <IconButton
//             variant="svg"
//             {...(focused && { iconStyle: 'contained' })}
//             icon={camelize(title)}
//             color={focused ? 'black900' : 'secondary300'}
//             size={7}
//         />
//     );
// };

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
        tabBarShowLabel: true,
        headerShadowVisible: false,
        tabBarStyle: [$tabBar, { height: 64 + bottom }],
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
        // tabBarIcon: props => <BottomTabIcon {...props} title={route.name} />,
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
                name="ServiceStack"
                component={ServiceStack}
                options={{
                    title: 'Top Up',
                }}
            />
            <Tab.Screen
                name="FeedStack"
                component={FeedStack}
                options={{
                    title: 'Shop',
                }}
            />
            <Tab.Screen
                name="AccountStack"
                component={Accountscreen}
                options={{
                    title: 'Pay',
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
