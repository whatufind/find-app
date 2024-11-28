
import {
    backgroundColor,
    type BackgroundColorProps,
    border,
    type BorderProps,
    color,
    type ColorProps,
    createRestyleComponent,
    createVariant,
    layout,
    type LayoutProps,
    spacing,
    type SpacingProps,
    type VariantProps,
} from '@shopify/restyle';
import React, { type FC, type PropsWithChildren, type ReactElement, type ReactNode } from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import { Box } from '@/components';
import { type Theme } from '@/theme';
import { useTheme } from '@/theme/theme-provider';

type Props = VariantProps<Theme, 'inputVariants'> &
    VariantProps<Theme, 'inputSizeVariants', 'size'> &
    VariantProps<Theme, 'inputValidationStatus', 'status'> &
    BackgroundColorProps<Theme> &
    BorderProps<Theme> &
    SpacingProps<Theme> &
    LayoutProps<Theme> &
    PropsWithChildren;

const mode = createVariant({ themeKey: 'inputVariants' });
const breadth = createVariant({ themeKey: 'inputSizeVariants', property: 'size' });
const status = createVariant({ themeKey: 'inputValidationStatus', property: 'status' });

const RestyleView = createRestyleComponent<Props, Theme>([
    mode,
    breadth,
    backgroundColor,
    border,
    spacing,
    layout,
    status,
]);

type InputProps = Props &
    TextInputProps &
    ColorProps<Theme> & {
        right?: () => ReactNode;
        left?: () => ReactNode;
    };

const RestyleInputField = createRestyleComponent<InputProps, Theme>([color], TextInput);

export const Input: FC<InputProps> = ({
    variant = 'outline',
    size = 'default',
    status,
    placeholder = 'Type something',
    right,
    left,
    color = 'secondary',
    ...rest
}): ReactElement => {
    const theme = useTheme();

    return (
        <RestyleView variant={variant} status={status} size={size}>
            {left ? <Box>{left()}</Box> : null}
            <RestyleInputField
                flex={1}
                {...rest}
                color={color}
                placeholder={placeholder}
                placeholderTextColor={theme.colors[color]}
            />
            {right ? <Box>{right()}</Box> : null}
        </RestyleView>
    );
};
