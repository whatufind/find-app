import { Icon } from '@/components';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export const HomeScreen = () => {
    return (
        <SafeAreaView>
            <Icon size={18} icon="avatar" variant="image" />
            <Icon variant="animation" icon={'loader'} />
        </SafeAreaView>
    );
};

export default HomeScreen;


/**
 * How to use
 *  <Icon variant="vector" icon="home" />
 *  <Icon variant="svg" icon="notification" />
 *  <Icon variant="image" icon="avatar" />
 *  */
