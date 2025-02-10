import {type ComponentProps} from 'react';
import {type BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  type CompositeScreenProps,
  type NavigationContainer,
  type NavigatorScreenParams,
} from '@react-navigation/native';
import {type NativeStackScreenProps} from '@react-navigation/native-stack';

export interface NavigationProps
  extends Partial<ComponentProps<typeof NavigationContainer>> {}

//bottom nav related types
export type RootNavigatorParamList = {
  UnAuthenticatedStack: NavigatorScreenParams<UnAuthenticatedStackNavigatorParamList>;
  AuthenticatedStack: NavigatorScreenParams<AuthenticatedStackNavigatorParamList>;
  AccountDrawer: NavigatorScreenParams<AccountDrawerStackNavigatorParamList>;
};

//unauthenticated stack related types

export type UnAuthenticatedStackNavigatorParamList = {
  Login: undefined;
};

export type AccountDrawerStackNavigatorParamList = {
  Login: undefined;
};

//authenticated stack related types

export type AuthenticatedStackNavigatorParamList = {
  Root: NavigatorScreenParams<BottomTabNavigatorParamList>;
  Register: undefined;
  ServiceDetails: undefined;
  Login: undefined;
  Requesters: undefined;
  'Public Profile': undefined;
  Chat: {
    user: {email: string; id: string; name: string; profilePicture: string};
    chatId:string
  };
};

//all screen params for bottom tab
export type BottomTabNavigatorParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  CommunityStack: NavigatorScreenParams<CommunityStackParamList>;
  AccountStack: NavigatorScreenParams<AccountStackParamList>;
  ChatStack: NavigatorScreenParams<FeedStackParamList>;
};

// 1: home related types
export type HomeStackParamList = {
  Home: undefined;
  Account: undefined;
};

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, T>;

// 2: service related types
export type CommunityStackParamList = {
  Community: undefined;
};

export type CommunityStackScreenProps<T extends keyof CommunityStackParamList> =
  NativeStackScreenProps<CommunityStackParamList, T>;

// 3: feed related types
export type FeedStackScreenProps<T extends keyof FeedStackParamList> =
  NativeStackScreenProps<FeedStackParamList, T>;

export type FeedStackParamList = {
  Feed: undefined;
};

// 3: Account related types
export type AccountStackScreenProps<T extends keyof AccountStackParamList> =
  NativeStackScreenProps<AccountStackParamList, T>;

export type AccountStackParamList = {
  Account: undefined;
};

//gloabl types
export type RootNavigatorScreenProps<T extends keyof RootNavigatorParamList> =
  NativeStackScreenProps<RootNavigatorParamList, T>;

export type UnAuthenticatedStackNavigatorScreenProps<
  T extends keyof UnAuthenticatedStackNavigatorParamList,
> = NativeStackScreenProps<UnAuthenticatedStackNavigatorParamList, T>;

export type AuthenticatedStackNavigatorScreenProps<
  T extends keyof AuthenticatedStackNavigatorParamList,
> = NativeStackScreenProps<AuthenticatedStackNavigatorParamList, T>;

export type BottomTabNavigatorScreenProps<
  T extends keyof BottomTabNavigatorParamList,
> = CompositeScreenProps<
  BottomTabScreenProps<BottomTabNavigatorParamList, T>,
  AuthenticatedStackNavigatorScreenProps<
    keyof AuthenticatedStackNavigatorParamList
  >
>;

declare global {
  namespace ReactNavigation {
    export interface RootParamList
      extends RootNavigatorParamList,
        UnAuthenticatedStackNavigatorParamList,
        AuthenticatedStackNavigatorParamList,
        HomeStackParamList,
        CommunityStackParamList,
        AccountStackParamList,
        FeedStackParamList {}
  }
}
