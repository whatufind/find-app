import React, { type ReactElement } from 'react';
import { ThemeProvider } from '@shopify/restyle';

import theme from '@/theme';

import 'react-native-gesture-handler';
import { Text } from '@/components';


export const App = (): ReactElement => {
  return (
    <ThemeProvider theme={theme}>
      <Text>helloe there</Text>
    </ThemeProvider>
  );
};

export default App;
