import React, { type ReactElement } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthStore } from '@/hooks/store/useAuthStore';
import { type NavigationProps, type RootNavigatorParamList } from '@/types/navigation';

import { AuthenticatedNavigator } from './AuthenticatedNavigator';
import { UnAuthenticatedNavigator } from './UnAuthenticatedNavigator';
import { navigationRef } from '@/utils/navigationHelper';
import AccountDrawerNavigator from './drawers/AccountDrawerNavigator';
import { Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export const Stack = createNativeStackNavigator<RootNavigatorParamList>();

export const Navigator = (props: NavigationProps): ReactElement => {

  function buildDeepLinkFromNotificationData(data): string | null {
    return data?.link;
  }


    const linking = {
        prefixes: ['whatufind://', 'http://173.249.59.88/v1'],
        config: {
          screens: {
            AuthenticatedStack: {
              screens: {
                ServiceDetails: 'servicedetails/:id',
                'Public Profile':'publicprofile/:id',
              },
            },
            UnAuthenticatedStack: {
              screens: {
                Login: 'login',
              },
            },
          },
        },
        async getInitialURL() {
          const url = await Linking.getInitialURL();
          if (typeof url === 'string') {
            return url;
          }
          //getInitialNotification: When the application is opened from a quit state.
          const message = await messaging().getInitialNotification();
          const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
          if (typeof deeplinkURL === 'string') {
            return deeplinkURL;
          }
        },
        subscribe(listener: (url: string) => void) {
          const onReceiveURL = ({url}: {url: string}) => listener(url);

          // Listen to incoming links from deep linking
          const linkingSubscription = Linking.addEventListener('url', onReceiveURL);

          //onNotificationOpenedApp: When the application is running, but in the background.
          const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
            const url = buildDeepLinkFromNotificationData(remoteMessage.data);
            if (typeof url === 'string') {
              listener(url);
            }
          });

          return () => {
            linkingSubscription.remove();
            unsubscribe();
          };
        },
      };


    return (
        <NavigationContainer
        linking={linking}
        ref={navigationRef}
            {...props}

        //To do : implement bootsplash for splash screen
        // onReady={() => {
        //     void BootSplash.hide({ fade: true });
        // }}
        >
            <Stack.Navigator screenOptions={{ headerShown: false }}>

                    <Stack.Screen name="AuthenticatedStack" component={AuthenticatedNavigator} />
                    <Stack.Screen name="UnAuthenticatedStack" component={UnAuthenticatedNavigator} />
                    <Stack.Screen name="AccountDrawer" component={AccountDrawerNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigator;
