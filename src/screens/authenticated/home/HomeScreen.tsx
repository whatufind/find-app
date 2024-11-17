import { Clickable, Text } from '@/components';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export const HomeScreen = () => {
    return (
        <SafeAreaView>
            <Clickable
            ><Text>hi there</Text></Clickable>
        </SafeAreaView>
    );
};

export default HomeScreen;
