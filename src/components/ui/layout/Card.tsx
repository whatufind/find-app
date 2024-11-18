import { type Theme } from '@/theme';
import {
    backgroundColor,
    type BackgroundColorProps,
    border,
    type BorderProps,
    BoxProps,
    createRestyleComponent,
    createVariant,
    layout,
    type LayoutProps,
    opacity,
    type OpacityProps,
    spacing,
    type SpacingProps,
    TextProps,
    type VariantProps,
} from '@shopify/restyle';
import React, { createContext, type PropsWithChildren, type ReactElement, useContext, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';
import ImageBanner, { ImageBannerProps } from '../media-icons/ImageBanner';
import { Text } from '../typography/Text';
import { Box } from './Box';

interface CardContextType {
    cardWidth: number;
}

interface CardTitleType extends TextProps<Theme> {
    title: string;
}

export type CardProps = VariantProps<Theme, 'cardVariants'> &
    SpacingProps<Theme> &
    LayoutProps<Theme> &
    BorderProps<Theme> &
    BackgroundColorProps<Theme> &
    OpacityProps<Theme> &
    PropsWithChildren & Pick<ViewProps, 'onLayout'>;

const variant = createVariant<Theme, 'cardVariants'>({ themeKey: 'cardVariants' });
const CardContext = createContext<CardContextType | undefined>(undefined);

export const useCardContext = (): CardContextType => {
    const context = useContext(CardContext);
    if (!context) {
        throw new Error('useCardContext must be used within a CardProvider');
    }
    return context;
};

const RestyleView = createRestyleComponent<CardProps, Theme>([
    spacing,
    layout,
    border,
    backgroundColor,
    opacity,
    variant,
]);

export const CardTitle = ({ title, ...rest }: CardTitleType): ReactElement => {
    return (
        <Text variant="heading3" color="black" {...rest} p={4} mb={4}>
            {title}
        </Text>

    );
};

export const CardContent = ({ children }: PropsWithChildren): ReactElement => {
    return <Box padding={4}>{children}</Box>;
};

export const CardCover = (props: ImageBannerProps): ReactElement => {
    const { cardWidth } = useCardContext();
    return <ImageBanner width={cardWidth} {...props} />;
};

export const CardActions = ({ children, ...rest }: PropsWithChildren & BoxProps<Theme>): ReactElement => {
    return <Box padding={4} {...rest}>{children}</Box>;
};

export const Card = ({ children, borderRadius, ...rest }: CardProps): ReactElement => {
    const [cardWidth, setCardWidth] = useState(0);

    const onLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setCardWidth(width);
    };

    return (
        <CardContext.Provider value={{ cardWidth }}>
            <RestyleView borderRadius={borderRadius} onLayout={onLayout} {...rest}>
                {children}
            </RestyleView>
        </CardContext.Provider>
    );
};

Card.Title = CardTitle;
Card.Content = CardContent;
Card.CardCover = CardCover;
Card.Actions = CardActions;

export default Card;


