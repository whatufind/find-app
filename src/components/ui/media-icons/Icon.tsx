import { useTheme } from '@/theme/theme-provider';
import { animationType } from '@assets/constants/animations';
import { getIcon, type Icon as IconType } from '@assets/constants/icons';
import { getImage, type Image as ImageType } from '@assets/constants/images';
import React, { type FC, type ReactNode } from 'react';
import { Source } from 'react-native-fast-image';
import Animation from '../feedback/Animation';
import FastImage from './FastImage';
import { VectorIcon, type VectorIconProps } from './VectorIcon';

export interface IconProps extends Omit<VectorIconProps, 'name'> {
    icon: IconType | string | ImageType | animationType;
    variant?: 'vector' | 'svg' | 'image' | 'animation';
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
    const imageSource = getImage(icon as ImageType);

    const renderIcon = (): ReactNode => {
        switch (variant) {
            case 'vector':
                return <VectorIcon name={icon} size={size} color={color} {...rest} />;
            case 'svg':
                return (
                    <SvgComponent color={iconColor} fontSize={iconSize} width={iconSize} height={iconSize} />
                );
            case 'animation':
                return (
                    <Animation width={`${iconSize}%`} height={iconSize} animation={icon as animationType} />
                );
            case 'image':
                return (
                    <FastImage
                        source={imageSource as Source}
                        resizeMode="contain"
                        width={iconSize}
                        height={iconSize}
                        {...rest}
                    />
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
