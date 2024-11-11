import { Icon } from '@/components';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export const HomeScreen = () => {
    return (
        <SafeAreaView>
            <Icon icon="notification" variant="svg" color="primary" />
        </SafeAreaView>
    );
};

export default HomeScreen;

