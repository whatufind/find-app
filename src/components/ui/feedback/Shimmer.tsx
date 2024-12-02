import React, { type FC, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { type BorderProps } from '@shopify/restyle';

import { type Theme } from '@/theme';
import { useTheme } from '@/theme/theme-provider';

import { Box } from '../layout/Box';
import { detectDevice } from '@/utils';

type ShimmerProps = {
    width: number;
    height: number;
} & BorderProps<Theme>;

export const Shimmer: FC<ShimmerProps> = ({ width, height, borderRadius = 'rounded-xs' }) => {
    const { colors } = useTheme();

    const shimmerValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.timing(shimmerValue, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
                easing: Easing.inOut(Easing.ease),
            })
        );
        animation.start();
        return () => animation.stop();
    }, [shimmerValue]);

    const translateX = shimmerValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width],
    });

    return (
        <Box
            overflow="hidden"
            bg="secondary50"
            width={width}
            height={height}
            borderRadius={borderRadius}>
            <Animated.View
                style={[
                    styles.shimmer,
                    {
                        width: width * 2,
                        transform: [{ translateX }],
                    },
                ]}>
                <LinearGradient
                    colors={['transparent', detectDevice.isAndroid ? colors.secondary : colors.secondary100, 'transparent']} // Create a vertical gradient
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                />
            </Animated.View>
        </Box>
    );
};

const styles = StyleSheet.create({
    shimmer: {
        flex: 1,
        opacity: 0.3,
    },
});

export default Shimmer;
