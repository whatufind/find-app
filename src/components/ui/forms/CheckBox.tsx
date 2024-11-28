import { type ColorProps, useTheme } from '@shopify/restyle';
import * as React from 'react';
import { type ReactElement, useEffect, useRef } from 'react';
import { Animated, type GestureResponderEvent, StyleSheet } from 'react-native';

import { Box, Clickable, Icon } from '@/components';
import { type Theme } from '@/theme';

export enum CheckboxStatus {
    Checked = 'checked',
    Unchecked = 'unchecked',
    Indeterminate = 'indeterminate'
}

type Props = {
    status: CheckboxStatus;
    disabled?: boolean;
    onPress?: (e: GestureResponderEvent) => void;
    uncheckedColor?: string;
    color?: ColorProps<Theme>['color'];
};

export const Checkbox = ({
    status,
    disabled = false,
    onPress,
    color = 'primary',
    ...rest
}: Props): ReactElement => {
    const { current: scaleAnim } = useRef<Animated.Value>(new Animated.Value(1));
    const isFirstRendering = useRef<boolean>(true);
    const AnimatedBox = Animated.createAnimatedComponent(Box);
    const theme = useTheme<Theme>();
    const animationDuration = theme.spacing[26] + theme.spacing[3];
    const icon =
        status === CheckboxStatus.Indeterminate
            ? 'minus-box'
            : status === CheckboxStatus.Checked
                ? 'checkbox-marked'
                : 'checkbox-blank-outline';

    const borderWidth = scaleAnim.interpolate({
        inputRange: [0.8, 1],
        outputRange: [7, 0],
    });

    const getBackgroundColor = (): keyof typeof theme.colors => {
        switch (status) {
            case CheckboxStatus.Unchecked:
                return disabled ? 'secondary100' : 'white';
            default:
                return 'transparent';
        }
    };

    const getIconColor = (): keyof typeof theme.colors => {
        if (
            (status === CheckboxStatus.Checked && disabled) ||
            (status === CheckboxStatus.Indeterminate && disabled)
        ) {
            return 'secondary300';
        } else if (status === CheckboxStatus.Checked || status === CheckboxStatus.Indeterminate) {
            return color;
        } else {
            return 'secondary300';
        }
    };

    useEffect(() => {
        if (isFirstRendering.current) {
            isFirstRendering.current = false;
            return;
        }

        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.85,
                duration: status === CheckboxStatus.Checked ? animationDuration * 0.75 : 0,
                useNativeDriver: false,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration:
                    status === CheckboxStatus.Checked
                        ? animationDuration * 0.75
                        : animationDuration * 0.75 * 2,
                useNativeDriver: false,
            }),
        ]).start();
    }, [status, scaleAnim, animationDuration]);

    return (
        <Clickable
            {...rest}
            onPress={onPress}
            disabled={disabled}
            accessibilityRole="checkbox"
            accessibilityLiveRegion="polite">
            <Box flexWrap="wrap" style={{ padding: theme.spacing[2] }}>
                <AnimatedBox overflow="hidden" style={{ transform: [{ scale: scaleAnim }] }}>
                    <Icon
                        icon={icon}
                        type="materialCommunity"
                        variant="vector"
                        size={8}
                        color={getIconColor()}
                    />
                    <Box alignItems="center" justifyContent="center" style={StyleSheet.absoluteFill}>
                        <AnimatedBox
                            backgroundColor={getBackgroundColor()}
                            style={{ padding: theme.spacing[3] + theme.spacing[2] }}
                            borderColor={color}
                            borderWidth={borderWidth}
                        />
                    </Box>
                </AnimatedBox>
            </Box>
        </Clickable>
    );
};

export default Checkbox;

/**
Usages:
  const [checked1, setChecked1] = useState(false);//based on bollean pass your status
<Checkbox
          status={checked1 ? CheckboxStatus.Checked : CheckboxStatus.Unchecked}
          onPress={() => {
            setChecked1(!checked1);
          }}
        />
**/
