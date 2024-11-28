import { type ColorProps } from '@shopify/restyle';
import React, {
    createContext,
    type PropsWithChildren,
    type ReactElement,
    useContext,
    useEffect,
    useRef,
} from 'react';
import { Animated } from 'react-native';

import { Box, Clickable } from '@/components';
import { type Theme } from '@/theme';
import { useTheme } from '@/theme/theme-provider';

type RadioContextType = {
    value: string;
    onValueChange: (item: string) => void;
};

type RadioProps = RadioContextType & PropsWithChildren;

enum StatusType {
    CHECKED = 'checked',
    UNCHECKED = 'unchecked'
}

type RadioButtonProps = {
    value: string;
    status?: StatusType;
    disabled?: boolean;
    onPress?: (param?: string) => void;
    uncheckedColor?: string;
    color?: string;
};

const RadioContext = createContext<RadioContextType>({
    value: '',
    onValueChange: () => { },
});

export const Radio = ({ value, onValueChange, children }: RadioProps): ReactElement => {
    return (
        <RadioContext.Provider value={{ value, onValueChange }}>
            <>{children}</>
        </RadioContext.Provider>
    );
};

const RadioButton = ({
    disabled,
    onPress,
    value,
    status = StatusType.UNCHECKED,
    ...rest
}: RadioButtonProps): ReactElement => {
    const theme = useTheme();
    const borderWidth = theme.spacing[2];

    const context = useContext<RadioContextType>(RadioContext);
    const { current: borderAnim } = useRef<Animated.Value>(new Animated.Value(borderWidth));
    const isFirstRendering = useRef<boolean>(true);

    const AnimatedBox = Animated.createAnimatedComponent(Box);

    const getBorderColor = (
        checked: boolean,
        disabled: boolean = false
    ): ColorProps<Theme>['color'] => {
        return disabled && checked ? 'secondary300' : checked ? 'primary' : 'secondary300';
    };

    useEffect(() => {
        if (isFirstRendering.current) {
            isFirstRendering.current = false;
            return;
        }

        if (status === StatusType.CHECKED) {
            borderAnim.setValue(1.2);

            Animated.timing(borderAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }).start();
        } else {
            borderAnim.setValue(10);

            Animated.timing(borderAnim, {
                toValue: borderWidth,
                duration: 150,
                useNativeDriver: false,
            }).start();
        }
    }, [status, borderAnim, borderWidth]);

    const handlePress = (value: string): void => {
        context.onValueChange !== null && context.onValueChange !== undefined
            ? context?.onValueChange(value)
            : onPress?.(value);
    };

    const isChecked = (): StatusType => {
        if (context.value !== undefined && context.value !== null) {
            return context.value === value ? StatusType.CHECKED : StatusType.UNCHECKED;
        } else {
            return status;
        }
    };

    const checked = isChecked() === StatusType.CHECKED;

    return (
        <Clickable
            {...(!(disabled ?? false) && {
                onPress: () => {
                    handlePress(value);
                },
            })}
            accessibilityRole="radio"
            accessibilityState={{ disabled, checked }}
            accessibilityLiveRegion="polite"
            {...rest}>
            <AnimatedBox
                borderRadius="rounded-full"
                height={theme.spacing[8]}
                width={theme.spacing[8]}
                margin={4}
                backgroundColor={disabled === true ? 'secondary100' : 'white'}
                borderColor={getBorderColor(checked, disabled)}
                opacity={disabled === true ? 0.5 : 1}
                borderWidth={checked ? 7 : borderAnim}
            />
        </Clickable>
    );
};

Radio.RadioButton = RadioButton;
export default Radio;

// usages with list
/*
<Radio
  value={value}
  onValueChange={(value: string) => {
    setValue(value);
  }}>
  <List>
    <List.Item
      title="Card"
      description="Your payment details"
      left={() => <Radio.RadioButton value="card"/>}
    />
    <List.Item
      title="UPI"
      description="Your payment details"
      left={() => <Radio.RadioButton value="upi"/>}
    />
  </List>
</Radio>
*/
