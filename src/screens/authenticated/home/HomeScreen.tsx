import { VectorIcon } from '@/components';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export const HomeScreen = () => {
    return (
        <SafeAreaView>
            <VectorIcon name="home" type="ant" />
        </SafeAreaView>
    );
};

export default HomeScreen;

