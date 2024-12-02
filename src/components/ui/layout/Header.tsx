import React, { type PropsWithChildren, type ReactElement } from 'react';
import { useNavigation } from '@react-navigation/native';
import { BoxProps, TextProps, type LayoutProps } from '@shopify/restyle';

import { useSafeAreaInsetsStyle } from '@/hooks/useSafeAreaInsetsStyle';
import { type Theme } from '@/theme';
import { useTheme } from '@/theme/theme-provider';

import { IconButton, type IconButtonProps } from '../media-icons/IconButton';

import { Box } from './Box';
import { ContentSafeAreaView } from './ContentSafeAreaView';
import { Text } from '../typography/Text';
import { IconProps } from '../media-icons/Icon';

export const Header = ({ children, bg = 'background', ...rest }: PropsWithChildren & BoxProps<Theme>): ReactElement => {
    const theme = useTheme();
    const containerInsets = useSafeAreaInsetsStyle(['top'], 'margin');

    return (
        <Box height={theme.sizes.minHeaderHeight} style={containerInsets} bg={bg} {...rest}>
            <ContentSafeAreaView height="100%" justifyContent="center">
                <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                    {children}
                </Box>
            </ContentSafeAreaView>
        </Box>
    );
};

const BackAction = ({ onPress, color = 'black', ...rest }: { onPress?: () => void } & Omit<IconProps, 'icon'>): ReactElement => {
    const navigation = useNavigation();
    const navigateBack = (): void => {
        navigation.goBack();
    };

    return (
        <IconButton
            right={8}
            size={8}
            icon="chevron-left"
            color={color}
            variant="vector"
            onPress={onPress ?? navigateBack}
            {...rest}
        />
    );
};

type ContentProps = {
    title: string;
    subTitle?: string | undefined;
} & LayoutProps<Theme> & TextProps<Theme>;

const Content = ({ title, subTitle = undefined, color = 'black', ...rest }: ContentProps): ReactElement => {
    return (
        <Box {...rest}>
            <Text variant="b2bold" color={color}>{title}</Text>
            {subTitle !== undefined && <Text variant="b3medium" color={color}>{subTitle}</Text>}
        </Box>
    );
};

const Action = (props: { icon: string; onPress?: () => void } & IconButtonProps): ReactElement => {
    return <IconButton {...props} left={14} />;
};

Header.BackAction = BackAction;
Header.Content = Content;
Header.Action = Action;

export default Header;


// useage
// <Header bg="black" >
// <Header.BackAction />
// <Header.Content title="hellow" subTitle="hey there" />
// <Header.Action variant="svg" icon="notification" />
// </Header>
