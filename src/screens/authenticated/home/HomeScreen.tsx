import Switch from '@/components/ui/forms/Switch';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export const HomeScreen = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <SafeAreaView >

            <Switch
                onValueChange={toggleSwitch}
                value={isEnabled}
            />
        </SafeAreaView>
    );
};

export default HomeScreen;

