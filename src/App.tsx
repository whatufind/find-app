import { ThemeProvider } from '@shopify/restyle';
import React, { type ReactElement } from 'react';

import theme from '@/theme';

import 'react-native-gesture-handler';
import { Navigator } from './navigators';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { persistor, store } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';

export const App = (): ReactElement => {
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



// import React, { useEffect, ReactElement } from 'react';
// import { PermissionsAndroid, Platform, Alert } from 'react-native';
// import messaging from '@react-native-firebase/messaging';
// import notifee from '@notifee/react-native';
// import { ThemeProvider } from '@shopify/restyle';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { Toaster } from 'sonner-native';

// import theme from '@/theme';
// import { Navigator } from './navigators';
// import { persistor, store } from './store/store';
// import { Button } from 'react-native';

// // Firebase token retrieval function
// const getToken = async (): Promise<string> => {
//   return await messaging().getToken();
// };

// // Request notification permission for Android (>= Android 13)
// const requestNotificationPermissionAndroid = async (): Promise<void> => {
//   if (Platform.OS === 'android' && Platform.Version >= 33) {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
//       );

//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log('Notification permission granted');
//         const token = await getToken();
//         console.log('FCM Token:', token);
//       } else {
//         console.log('Notification permission denied');
//       }
//     } catch (error) {
//       console.error('Failed to request notification permission:', error);
//     }
//   } else {
//     console.log('Notification permission is not required for this Android version');
//   }
// };

// // Display a notification using Notifee
// const onDisplayNotification = async (remoteMessage): Promise<void> => {
//   const channelId = await notifee.createChannel({
//     id: 'default',
//     name: 'Default Channel',
//   });

//   await notifee.displayNotification({
//     title: remoteMessage?.title,
//     body: 'Main body content of the notification',
//     android: {
//       channelId,
//       pressAction: {
//         id: 'default',
//       },
//     },
//   });
// };

// // Main App component
// export const App = (): ReactElement => {
//   useEffect(() => {
//     requestNotificationPermissionAndroid();

//     // Handle foreground notifications
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//    await  onDisplayNotification(remoteMessage);
//     });

//     return unsubscribe;
//   }, []);



//   return (
//     <GestureHandlerRootView>
//       <Button title="send" onPress={onDisplayNotification}/>
//       {/* <ThemeProvider theme={theme}>
//         <SafeAreaProvider>
//           <Provider store={store}>
//             <PersistGate loading={null} persistor={persistor}>
//               <Navigator />
//             </PersistGate>
//           </Provider>
//           <Toaster />
//         </SafeAreaProvider>
//       </ThemeProvider> */}
//     </GestureHandlerRootView>
//   );
// };

// export default App;
