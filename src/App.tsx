import { ThemeProvider } from '@shopify/restyle';
import React, { useEffect, type ReactElement } from 'react';

import theme from '@/theme';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'sonner-native';
import { Navigator } from './navigators';
import { persistor, store } from './store/store';
import messaging from '@react-native-firebase/messaging';

import notifee from '@notifee/react-native';
import { Linking } from 'react-native';

const onDisplayNotification = async (remoteMessage): Promise<void> => {
  console.log(remoteMessage);
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });
  await notifee.displayNotification({
    title: 'tadadadafad',
    body: remoteMessage?.notification?.body,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
    data: remoteMessage?.data, // Include data for linking
  });
};


export const App = (): ReactElement => {
  useEffect(() => {
    // Foreground notification handler
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      await onDisplayNotification(remoteMessage);
    });

    // App opened from background
    const unsubscribeOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      const url = remoteMessage?.data?.url;
      console.log(url,'what is url');
      if (url) {
        Linking.openURL(url);
      }
    });

    // App opened from quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log(remoteMessage,'what is this');
        const url = remoteMessage?.data?.url;
        if (url) {
          Linking.openURL(url);
        }
      });

    return () => {
      unsubscribe();
      unsubscribeOpened();
    };
  }, []);

  return (
    <GestureHandlerRootView>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <Navigator />
            </PersistGate>
          </Provider>
          <Toaster />
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
