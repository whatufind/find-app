import {
    createRestyleComponent,
    layout,
    type LayoutProps,
    spacingShorthand,
    type SpacingShorthandProps,
} from '@shopify/restyle';
import React, { type PropsWithChildren } from 'react';

import { type Theme } from '@/theme';

type VStackProps =
    SpacingShorthandProps<Theme> &
    LayoutProps<Theme> &
    PropsWithChildren & {
        reverse?: boolean;
    };

const RestyleView = createRestyleComponent<VStackProps, Theme>([spacingShorthand, layout]);

export const VStack: React.FC<VStackProps> = ({ children, reverse = false, ...rest }) => {
    const flexDirection = reverse ? 'column-reverse' : 'column';

    return (
        <RestyleView flexDirection={flexDirection} {...rest}>
            {children}
        </RestyleView>
    );
};

export default VStack;
