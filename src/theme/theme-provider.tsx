import {
    ThemeProvider as RestyleThemeProvider,
    useTheme as useRestyleTheme,
} from '@shopify/restyle';
import React, { type ReactElement } from 'react';

import theme, { type Theme } from './index';

interface ThemeProviderProps {
    children?: ReactElement;
}

export const ThemeProvider = ({ children }: ThemeProviderProps): ReactElement => {
    return <RestyleThemeProvider theme={theme}>{children}</RestyleThemeProvider>;
};

export const useTheme = (): Theme => {
    const restyleTheme = useRestyleTheme<Theme>();

    return restyleTheme;
};
