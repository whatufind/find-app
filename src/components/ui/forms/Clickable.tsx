import React, { type FC, type PropsWithChildren, type ReactElement } from 'react';
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';

import { Theme } from '@/theme';
import { useTheme } from '@/theme/theme-provider';
import { backgroundColorShorthand, BackgroundColorShorthandProps, border, BorderProps, createRestyleComponent, layout, LayoutProps, spacingShorthand, SpacingShorthandProps } from '@shopify/restyle';

interface ClickableProps extends PropsWithChildren, TouchableOpacityProps, SpacingShorthandProps<Theme>, LayoutProps<Theme>, BorderProps<Theme>, BackgroundColorShorthandProps<Theme> { }

const RestyledTouchable = createRestyleComponent<ClickableProps, Theme>([
    spacingShorthand,
    layout, border, backgroundColorShorthand,
], TouchableOpacity);

export const Clickable: FC<ClickableProps> = ({ children, ...rest }): ReactElement => {
    const theme = useTheme();

    return (
        <RestyledTouchable {...rest} activeOpacity={theme.sizes.activeOpacity}>
            {children}
        </RestyledTouchable>
    );
};

export default Clickable;
