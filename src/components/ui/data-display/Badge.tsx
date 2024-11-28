import { type Icon as IconType } from '@assets/constants/icons';
import {
    backgroundColor,
    type BackgroundColorProps,
    border,
    type BorderProps,
    createRestyleComponent,
    createVariant,
    layout,
    LayoutProps,
    spacing,
    SpacingProps,
    type VariantProps,
} from '@shopify/restyle';
import React, { type FC, type PropsWithChildren } from 'react';

import { Box, HStack, Icon, Text } from '@/components';
import { type Theme } from '@/theme';
import { useStringHelper } from '@/utils';

type RestyleProps = BorderProps<Theme> &
    BackgroundColorProps<Theme> &
    VariantProps<Theme, 'badgeVariant', 'variant'> &
    VariantProps<Theme, 'badgePosition', 'placement'> &
    VariantProps<Theme, 'badgeType', 'type'> &
    LayoutProps<Theme> & SpacingProps<Theme> &
    PropsWithChildren
    ;

type BadgeProps = RestyleProps & {
    content: string;
    icon?: IconType;
};

const badgeVariant = createVariant({ themeKey: 'badgeVariant', property: 'variant' });
const type = createVariant({ themeKey: 'badgeType', property: 'type' });
const placement = createVariant({
    themeKey: 'badgePosition',
    property: 'placement',
});

const RestyleView = createRestyleComponent<RestyleProps, Theme>([
    badgeVariant,
    placement,
    type,
    border,
    backgroundColor,
    layout,
    spacing,
]);

export const Badge: FC<BadgeProps> = ({
    content,
    icon,
    children,
    variant = 'secondary',
    ...rest
}) => {
    const { capitalFirstLetter } = useStringHelper();
    const color = rest.type === 'outlined' ? variant : 'white';

    return (
        <Box alignSelf="flex-start">
            <RestyleView {...rest} padding={2} variant={variant}  >
                <HStack alignItems="center" justifyContent="center">
                    {icon !== undefined && <Icon icon={icon} variant="svg" color={color} size={6} />}
                    {content && <Text color={color} lineHeight={14} variant="b4semiBold" >
                        {capitalFirstLetter(content)}
                    </Text>}
                </HStack>
            </RestyleView>
            {children}
        </Box>
    );
};

export default Badge;

// usege
// <Badge placement="topRight" variant="danger" content="" icon="notification" >
// <Icon variant="svg" icon="notification" size={20} />
// </Badge>
