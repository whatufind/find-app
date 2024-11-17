/* eslint-disable @typescript-eslint/no-shadow */
import {
    backgroundColor,
    type BackgroundColorProps,
    border,
    type BorderProps,
    color,
    type ColorProps,
    createRestyleComponent,
    createVariant,
    layout,
    type LayoutProps,
    spacing,
    type SpacingProps,
    spacingShorthand,
    type SpacingShorthandProps,
    typography,
    type TypographyProps,
    type VariantProps,
} from '@shopify/restyle';
import React, {
    createContext,
    type FC,
    type PropsWithChildren,
    type ReactElement,
    useContext,
    useMemo,
} from 'react';
import {
    ActivityIndicator,
    type TextProps as RNTextProps,
    StyleSheet,
    type TouchableOpacityProps,
} from 'react-native';

import { type Theme } from '@/theme';
import {
    type ButtonBaseType,
    type ButtonDisabledType,
    type ButtonSizeType,
    type ButtonTextType,
    type ButtonType,
} from '@/theme/variants/button-variants';

import { Box } from '../layout/Box';
import Icon, { type IconProps } from '../media-icons/Icon';

import { Text } from '../typography/Text';
import Clickable from './Clickable';

type Props = VariantProps<Theme, 'buttonVariantsBase'> &
    VariantProps<Theme, 'buttonVariantsType', 'type'> &
    VariantProps<Theme, 'buttonVariantsDisabled', 'disabled'> &
    VariantProps<Theme, 'buttonVariantsSize', 'size'> &
    LayoutProps<Theme> &
    BackgroundColorProps<Theme> &
    BorderProps<Theme> &
    SpacingProps<Theme> &
    SpacingShorthandProps<Theme> &
    PropsWithChildren;

const variant = createVariant({ themeKey: 'buttonVariantsBase' });
const type = createVariant({ themeKey: 'buttonVariantsType', property: 'type' });
const disabled = createVariant({ themeKey: 'buttonVariantsDisabled', property: 'disabled' });
const size = createVariant({ themeKey: 'buttonVariantsSize', property: 'size' });

const RestyleView = createRestyleComponent<Props, Theme>([
    layout,
    backgroundColor,
    border,
    variant,
    spacing,
    spacingShorthand,
    type,
    disabled,
    size,
]);

const types = {
    contained: 'Contained',
    outlined: 'Outlined',
    text: 'Text',
};

interface ButtonTextProps {
    title: string;
}

type TextProps = VariantProps<Theme, 'buttonVariantsText'> &
    VariantProps<Theme, 'buttonVariantsTextSize', 'size'> &
    TypographyProps<Theme> &
    ColorProps<Theme> &
    RNTextProps;

const textVariants = createVariant({ themeKey: 'buttonVariantsText' });
const textSizeVariants = createVariant({ themeKey: 'buttonVariantsTextSize', property: 'size' });

const RestyleText = createRestyleComponent<TextProps, Theme>(
    [typography, color, textVariants, textSizeVariants],
    Text
);

export const ButtonText: FC<ButtonTextProps> = ({ title }): ReactElement => {
    const { variant, type, disabled, size } = useContext<ButtonContextType>(ButtonContext);

    const textVariant = (variant + types[type]) as ButtonTextType;

    return (
        <Box>
            <RestyleText variant={disabled ? 'disabledText' : textVariant} size={size}>
                {title}
            </RestyleText>
        </Box>
    );
};


interface ButtonIconProps extends IconProps { }

const ButtonIcon: FC<ButtonIconProps> = ({ icon, variant, color, size, ...rest }): ReactElement => {
    return (
        <Box>
            <Icon icon={icon} variant={variant} size={size} color={color} {...rest} />
        </Box>
    );
};

interface ButtonContextType {
    type: ButtonType;
    variant: ButtonBaseType;
    disabled: boolean;
    size: ButtonSizeType;
}

const ButtonContext = createContext<ButtonContextType>({
    variant: 'primary',
    type: 'contained',
    disabled: false,
    size: 'md',
});

const { Provider } = ButtonContext;

type ButtonProps = TouchableOpacityProps &
    Pick<Props, Exclude<keyof Props, 'disabled'>> & {
        disabled?: boolean;
        loading?: boolean;
    };

const Button = ({
    children,
    onPress,
    disabled = false,
    variant = 'primary',
    type = 'contained',
    size = 'md',
    loading = false,
    ...rest
}: ButtonProps): ReactElement => {
    const memorizedValue = useMemo(() => {
        return {
            variant,
            type,
            disabled,
            size,
        };
    }, [variant, type, disabled, size]);

    const disabledType = types[type] as ButtonType;

    return (
        <Provider value={memorizedValue}>
            <RestyleView
                variant={variant}
                type={type}
                {...(disabled && {
                    disabled: `${disabledType.toLowerCase()}Disabled` as ButtonDisabledType,
                })}
                size={size}
                {...rest}>
                <Clickable onPress={onPress} disabled={disabled} style={styles.flex}>
                    {loading ? <ActivityIndicator /> : children}
                </Clickable>
            </RestyleView>
        </Provider>
    );
};

Button.Text = ButtonText;
Button.Icon = ButtonIcon;

const styles = StyleSheet.create({
    flex: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12,
        height: '100%',
        justifyContent: 'center',
    },
});

export { Button };

