import {
    backgroundColor,
    type BackgroundColorProps,
    border,
    type BorderProps,
    createRestyleComponent,
    createVariant,
    layout,
    type LayoutProps,
    opacity,
    type OpacityProps,
    position,
    type PositionProps,
    spacing,
    type SpacingProps,
    type VariantProps,
} from '@shopify/restyle';
import React, { type FC, type PropsWithChildren } from 'react';

import { type Theme } from '@/theme';

import { Clickable } from '../forms/Clickable';
import { Icon, type IconProps } from './Icon';

type RestyleProps = VariantProps<Theme, 'iconButtonVariants', 'iconStyle'> &
    SpacingProps<Theme> &
    LayoutProps<Theme> &
    PositionProps<Theme> &
    BackgroundColorProps<Theme> &
    BorderProps<Theme> &
    OpacityProps<Theme> &
    PropsWithChildren;

const iconStyle = createVariant({ themeKey: 'iconButtonVariants', property: 'iconStyle' });

const RestyleView = createRestyleComponent<RestyleProps, Theme>([
    iconStyle,
    spacing,
    layout,
    backgroundColor,
    border,
    opacity,
    position,
]);

export type IconButtonProps = IconProps &
    RestyleProps & {
        onPress?: () => void;
        disabled?: boolean;
    };

export const IconButton: FC<IconButtonProps> = ({
    icon,
    onPress,
    variant = 'image',
    size = 7,
    color,
    iconStyle,
    disabled = false,
    padding,
    ...rest
}) => {
    const content = (
        <RestyleView
            iconStyle={iconStyle}
            padding={padding}
            backgroundColor={
                iconStyle === 'contained' && color
                    ? (`${color}100` as BackgroundColorProps<Theme>['backgroundColor'])
                    : undefined
            }
            opacity={disabled ? 0.3 : 1}
            borderColor={iconStyle === 'outlined' ? color : undefined}
            {...rest}
        >
            <Icon icon={icon} variant={variant} size={size} color={color} />
        </RestyleView>
    );

    return onPress ? (
        <Clickable onPress={onPress} disabled={disabled}>
            {content}
        </Clickable>
    ) : (
        content
    );
};

export default IconButton;
