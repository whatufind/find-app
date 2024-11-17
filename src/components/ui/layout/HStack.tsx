import {
    createRestyleComponent,
    layout,
    type LayoutProps,
    position,
    type PositionProps,
    spacingShorthand,
    type SpacingShorthandProps,
} from '@shopify/restyle';
import React, { type FC, type PropsWithChildren } from 'react';

import { type Theme } from '@/theme';

type HStackProps =
    SpacingShorthandProps<Theme> &
    LayoutProps<Theme> &
    PositionProps<Theme> &
    PropsWithChildren & {
        reverse?: boolean;
    };

const RestyleView = createRestyleComponent<HStackProps, Theme>([
    spacingShorthand,
    layout,
    position,
]);

export const HStack: FC<HStackProps> = ({ children, reverse = false, ...rest }) => {
    const flexDirection = reverse ? 'row-reverse' : 'row';

    return (
        <RestyleView flexDirection={flexDirection} alignItems="center" {...rest}>
            {children}
        </RestyleView>
    );
};

export default HStack;
