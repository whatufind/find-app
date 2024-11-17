import {
    createRestyleComponent,
    layout,
    type LayoutProps,
    spacingShorthand,
    type SpacingShorthandProps,
} from '@shopify/restyle';
import React, { type FC, type PropsWithChildren } from 'react';

import { type Theme } from '@/theme';

type CenterProps =
    SpacingShorthandProps<Theme> &
    LayoutProps<Theme> &
    PropsWithChildren;

const RestyleView = createRestyleComponent<CenterProps, Theme>([spacingShorthand, layout]);

export const Center: FC<CenterProps> = ({ children, ...rest }) => {
    return (
        <RestyleView justifyContent="center" alignItems="center" {...rest}>
            {children}
        </RestyleView>
    );
};

export default Center;
