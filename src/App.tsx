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

const onDisplayNotification = async (remoteMessage): Promise<void> => {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });
  await notifee.displayNotification({
    title: remoteMessage?.notification?.title,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
  });
};


export const App = (): ReactElement => {
  useEffect(() => {
    // Handle foreground notifications
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      await onDisplayNotification(remoteMessage);
    });

    return unsubscribe;
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
