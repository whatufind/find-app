import { Box, ContentSafeAreaView, HStack } from '@/components';
import Shimmer from '@/components/ui/feedback/Shimmer';
import theme from '@/theme';
import { backgroundColor } from '@shopify/restyle';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export const HomeScreen = () => {
    return (
        <SafeAreaView >

            <HStack justifyContent="space-between">
                <Shimmer width={theme.sizes.safeWidth / 1.8} height={300} />
                <Shimmer width={theme.sizes.safeWidth / 1.8} height={300} />
            </HStack>

        </SafeAreaView>
    );
};

export default HomeScreen;

