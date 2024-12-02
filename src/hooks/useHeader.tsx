import React, { type ReactElement, useEffect, type useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export const useHeader = (
    header: () => ReactElement,
    deps: Parameters<typeof useLayoutEffect>[1] = []
): void => {
    const navigation = useNavigation();
    const Component = header;

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: () => <Component />,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, navigation, Component]);
};

export default useHeader;
