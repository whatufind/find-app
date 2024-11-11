import { useTheme } from '@/theme/theme-provider';
import { getIcon, type Icon as IconType } from '@assets/constants/icons';
import React, { type FC, type ReactNode } from 'react';
import { VectorIcon, type VectorIconProps } from './VectorIcon';

export interface IconProps extends Omit<VectorIconProps, 'name'> {
    icon: IconType | string;
    variant?: 'vector' | 'svg';
}

export const Icon: FC<IconProps> = ({
    icon = 'home',
    variant = 'vector',
    size = 8,
    color = 'black',
    ...rest
}) => {
    const theme = useTheme();

    const iconSize = theme.spacing[size as keyof typeof theme.spacing];
    const iconColor = theme.colors[color as keyof typeof theme.colors];

    const SvgComponent = getIcon(icon as IconType);

    const renderIcon = (): ReactNode => {
        switch (variant) {
            case 'vector':
                return <VectorIcon name={icon} size={size} color={color} {...rest} />;
            case 'svg':
                return (
                    <SvgComponent color={iconColor} fontSize={iconSize} width={iconSize} height={iconSize} />
                );
            default:
                return <VectorIcon name="home" />;
        }
    };

    return renderIcon();
};

export default Icon;

/**
 * How to use
 *  <Icon variant="vector" icon="arrow-back" />
 *  <Icon variant="svg" icon="menu" />
 *  */
