import { Theme } from '@/theme';
import { type animationType, getAnimation } from '@assets/constants/animations';
import {
    backgroundColorShorthand,
    BackgroundColorShorthandProps,
    createRestyleComponent,
    LayoutProps,
    spacingShorthand,
    SpacingShorthandProps,
} from '@shopify/restyle';
import LottieView, { LottieViewProps } from 'lottie-react-native';
import React from 'react';

interface LottieProps {
    animation: animationType;
}

interface RestyledAnimationProps
    extends LottieViewProps,
    SpacingShorthandProps<Theme>,
    BackgroundColorShorthandProps<Theme>,
    LayoutProps<Theme> { }

const RestyledAnimation = createRestyleComponent<RestyledAnimationProps, Theme>(
    [spacingShorthand, backgroundColorShorthand],
    LottieView
);

export const Animation: React.FC<LottieProps & Omit<RestyledAnimationProps, 'source'>> = ({
    animation = 'loader',
    width = '30%',
    height = 40,
    autoPlay = true,
    loop = true,
    ...rest
}) => {
    const animate = getAnimation(animation);

    return (
        <RestyledAnimation
            source={animate}
            width={width}
            height={height}
            autoPlay={autoPlay}
            loop={loop}
            resizeMode="cover"
            {...rest}
        />
    );
};

export default Animation;
