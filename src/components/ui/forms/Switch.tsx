import theme from '@/theme';
import { createRestyleComponent } from '@shopify/restyle';
import React, { FC, ReactElement } from 'react';
import { Switch as RNSwitch, SwitchProps as RNSwitchProps } from 'react-native';

type ColorProps = keyof typeof theme.colors

type SwitchProps = Omit<RNSwitchProps, 'trackColor' | 'thumbColor' | 'ios_backgroundColor'> & {
    trackColor?: ColorProps
    thumbColor?: ColorProps,
    ios_backgroundColor?: ColorProps
};

const RestyleSwitch = createRestyleComponent([], RNSwitch);

export const Switch: FC<SwitchProps> = ({ ...rest }): ReactElement => {
    return (
        <RestyleSwitch
            trackColor={{ false: theme.colors.secondary, true: theme.colors.primary }}
            thumbColor={theme.colors.white}
            ios_backgroundColor={theme.colors.secondary200}
            {...rest}
        />
    );
};

export default Switch;
