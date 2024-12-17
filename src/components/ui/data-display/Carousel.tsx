import theme from '@/theme';
import React, { FC, useEffect, useRef } from 'react';
import {
    Animated,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    TouchableOpacityProps,
} from 'react-native';
import { s } from 'react-native-size-matters';
import { Box } from '../layout/Box';
import HStack from '../layout/HStack';
import ImageBanner from '../media-icons/ImageBanner';

type CarouselProps = {
    images: string[];
    autoScrollInterval?: number;
    height?: number;
} & TouchableOpacityProps;

export const Carousel: FC<CarouselProps> = ({
    images,
    autoScrollInterval = 3000,
    height,
    onPress,
}) => {
    const AnimatedBox = Animated.createAnimatedComponent(Box);
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView>(null);
    const currentIndex = useRef(0); // Keep track of the active index

    // Update current index on user scroll
    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        currentIndex.current = Math.round(offsetX / theme.sizes.safeWidth);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            // Increment index and loop back to 0 if necessary
            currentIndex.current = (currentIndex.current + 1) % images.length;
            scrollViewRef.current?.scrollTo({
                x: currentIndex.current * theme.sizes.safeWidth,
                animated: true,
            });
        }, autoScrollInterval);

        // Clear interval on component unmount
        return () => clearInterval(interval);
    }, [images.length, autoScrollInterval]);

    return (
        <>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                ref={scrollViewRef}
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: {
                                    x: scrollX,
                                },
                            },
                        },
                    ],
                    // Attach the listener to track user scrolls
                    { useNativeDriver: false, listener: onScroll },
                )}
                scrollEventThrottle={16}>
                {images.map((image, imageIndex) => (
                    <ImageBanner
                        key={imageIndex}
                        borderRadius="rounded-sm"
                        variant="remote"
                        height={height}
                        source={image}
                    />
                ))}
            </ScrollView>
            <HStack justifyContent="center" mt={3}>
                {images.map((_, imageIndex) => {
                    const width = scrollX.interpolate({
                        inputRange: [
                            s(theme.sizes.safeWidth * (imageIndex - 1)),
                            s(theme.sizes.safeWidth * imageIndex),
                            s(theme.sizes.safeWidth * (imageIndex + 1)),
                        ],
                        outputRange: [s(8), s(16), s(8)],
                        extrapolate: 'clamp',
                    });
                    const backgroundColor = scrollX.interpolate({
                        inputRange: [
                            theme.sizes.safeWidth * (imageIndex - 1),
                            theme.sizes.safeWidth * imageIndex,
                            theme.sizes.safeWidth * (imageIndex + 1),
                        ],
                        outputRange: [
                            theme.colors.neutral300,
                            theme.colors.primary,
                            theme.colors.neutral100,
                        ],
                        extrapolate: 'clamp',
                    });

                    return (
                        <AnimatedBox
                            height={s(8)}
                            width={s(8)}
                            mx={3}
                            borderRadius="rounded-full"
                            key={imageIndex}
                            style={{
                                width,
                                backgroundColor,
                            }}
                        />
                    );
                })}
            </HStack>
        </>
    );
};

export default Carousel;

// how to use

/* <Carousel
height={calculateImgHeight(theme.sizes.safeWidth, 1066, 600)}
images={[
  'https://saralifestyle.com/_next/image?url=https%3A%2F%2Fprod.saralifestyle.com%2FImages%2FContent%2Fa72e187111804e1f90ae25d8c7db0b46.png&w=3840&q=75s',
  'https://saralifestyle.com/_next/image?url=https%3A%2F%2Fprod.saralifestyle.com%2FImages%2FContent%2Fa72e187111804e1f90ae25d8c7db0b46.png&w=3840&q=75s',
  'https://saralifestyle.com/_next/image?url=https%3A%2F%2Fprod.saralifestyle.com%2FImages%2FContent%2Fa72e187111804e1f90ae25d8c7db0b46.png&w=3840&q=75s',
  'https://saralifestyle.com/_next/image?url=https%3A%2F%2Fprod.saralifestyle.com%2FImages%2FContent%2Fa72e187111804e1f90ae25d8c7db0b46.png&w=3840&q=75s',
  'https://saralifestyle.com/_next/image?url=https%3A%2F%2Fprod.saralifestyle.com%2FImages%2FContent%2Fa72e187111804e1f90ae25d8c7db0b46.png&w=3840&q=75s',
]}
/> */
