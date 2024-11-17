import { ThemeProvider } from '@shopify/restyle';
import React, { type ReactElement } from 'react';

import theme from '@/theme';

import 'react-native-gesture-handler';
import { Navigator } from './navigators';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const App = (): ReactElement => {
  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <Navigator />
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

export default App;
  