import {
    border,
    type BorderProps,
    createRestyleComponent,
    createVariant,
    layout,
    type LayoutProps,
    spacingShorthand,
    SpacingShorthandProps,
    type VariantProps,
} from '@shopify/restyle';
import React, { type FC, type ReactElement } from 'react';
import { type ViewProps } from 'react-native';

import { type Theme } from '@/theme';

type DividerProps = VariantProps<Theme, 'dividerVariants'> &
    SpacingShorthandProps<Theme> &
    BorderProps<Theme> &
    LayoutProps<Theme> &
    ViewProps;

const variant = createVariant<Theme, 'dividerVariants'>({ themeKey: 'dividerVariants' });

const RestyleView = createRestyleComponent<DividerProps, Theme>([spacingShorthand, border, variant, layout]);

export const Divider: FC<DividerProps> = ({ borderWidth = 1, ...rest }): ReactElement => {
    return <RestyleView borderWidth={borderWidth} borderColor="secondary200" {...rest} />;
};

export default Divider;
