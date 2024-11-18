import {
    backgroundColor,
    type BackgroundColorProps,
    border,
    type BorderProps,
    type ColorProps,
    createRestyleComponent,
    layout,
    type LayoutProps,
    spacing,
    type SpacingProps,
    type TextProps,
} from '@shopify/restyle';
import React, {
    type FC,
    type PropsWithChildren,
    type ReactElement,
    type ReactNode,
    useState,
} from 'react';
import { LayoutAnimation, TouchableWithoutFeedback } from 'react-native';

import { Box, Divider, HStack, Icon, type IconProps, Text, VStack } from '@/components';
import { type Theme } from '@/theme';

type RestyleProps = SpacingProps<Theme> &
    LayoutProps<Theme> &
    BorderProps<Theme> &
    BackgroundColorProps<Theme> &
    PropsWithChildren;

const RestyleView = createRestyleComponent<RestyleProps, Theme>([
    spacing,
    layout,
    backgroundColor,
    border,
]);

type ListProps = PropsWithChildren;

export const List = ({ children }: ListProps): ReactElement => {
    return <Box>{children}</Box>;
};

type ListAccordionProps = PropsWithChildren & {
    title: string;
    subTitle?: string;
    id?: string | number;
    left?: () => ReactNode;
};

interface RestyleListAccordionProps extends RestyleProps, ListAccordionProps { }

const ListAccordion: FC<RestyleListAccordionProps> = ({
    title,
    subTitle,
    children,
    left,
    ...rest
}): ReactElement => {
    const [opened, setOpened] = useState<boolean>(false);

    const toggleAccordion = (): void => {
        LayoutAnimation.configureNext({
            duration: 300,
            create: { type: 'easeIn', property: 'opacity' },
            update: { type: 'linear', springDamping: 0.3, duration: 250 },
        });
        setOpened(!opened);
    };

    return (
        <RestyleView paddingVertical={2} {...rest}>
            <TouchableWithoutFeedback onPress={toggleAccordion}>
                <HStack g={4}>
                    {left != null ? left() : null}
                    <Box flex={1} justifyContent="space-between" flexDirection="row">
                        <VStack>
                            {title.length > 0 && <Text variant="b2bold">{title}</Text>}
                            {subTitle != null && <Text variant="b3regular">{subTitle}</Text>}
                        </VStack>
                        <Icon
                            variant="vector"
                            type="material"
                            icon={opened ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                            size={8}
                            color="secondary"
                        />
                    </Box>
                </HStack>
            </TouchableWithoutFeedback>
            {opened && <Box mt={4}>{children}</Box>}
        </RestyleView>
    );
};

type ListItemProps = {
    title?: string;
    description?: string;
    titleVariant?: TextProps<Theme>['variant'];
    descriptionVariant?: TextProps<Theme>['variant'];
    titleColor?: ColorProps<Theme>['color'];
    descriptionColor?: ColorProps<Theme>['color'];
    divider?: boolean;
    left?: () => ReactNode;
    right?: () => ReactNode;
};

interface RestyleListItemProps extends ListItemProps, RestyleProps { }

const ListItem: FC<RestyleListItemProps> = ({
    title,
    description,
    left,
    right,
    titleVariant = 'b2semiBold',
    descriptionVariant = 'b4regular',
    titleColor = 'black',
    descriptionColor = 'black',
    divider = false,
    ...rest
}): ReactElement => {
    return (
        <RestyleView
            alignItems="center"
            gap={6}
            paddingTop={5}
            paddingBottom={!divider ? 5 : 0}
            flexDirection="row"
            {...rest}>
            {left != null ? <Box>{left()}</Box> : null}
            <Box flex={1}>
                <Box justifyContent="space-between" alignItems="center" flexDirection="row">
                    <VStack flex={1}>
                        {title != null && (
                            <Text variant={titleVariant} color={titleColor}>
                                {title}
                            </Text>
                        )}
                        {description != null && (
                            <Text variant={descriptionVariant} color={descriptionColor}>
                                {description}
                            </Text>
                        )}
                    </VStack>
                    {right != null ? <Box>{right()}</Box> : null}
                </Box>
                {divider && (
                    <Divider
                        variant="line"
                        borderColor="secondary100"
                        mt={6}
                        mb={4}
                        borderWidth={0.5}
                    />
                )}
            </Box>
        </RestyleView>
    );
};

const ListIcon: FC<IconProps> = ({ variant, icon, ...rest }): ReactElement => {
    return <Icon icon={icon} variant={variant} {...rest} />;
};

type ListSectionProps = PropsWithChildren & RestyleProps;

const ListSection: FC<ListSectionProps> = ({ children, ...rest }): ReactElement => {
    return <RestyleView {...rest}>{children}</RestyleView>;
};

type ListSubHeaderProps = {
    title: string | number;
} & TextProps<Theme>;

const ListSubHeader: FC<ListSubHeaderProps> = ({
    title,
    variant = 'b3medium',
    ...rest
}): ReactElement => {
    return (
        <Box flex={1}>
            <Text variant={variant} {...rest}>
                {title}
            </Text>
        </Box>
    );
};

List.Accordion = ListAccordion;
List.Icon = ListIcon;
List.Item = ListItem;
List.Section = ListSection;
List.SubHeader = ListSubHeader;

export default List;

// Usages:
// <List>
//   <List.Accordion
//     left={() => (
//       <IconButton variant="svg" icon="home" color="primary" iconStyle="contained" size={7} />
//     )}
//     title="accordion1"
//     subTitle="accordion subtitle">
//     <List.Item
//       title="list item1"
//       description="list item description here"
//       left={() => (
//         <IconButton variant="svg" icon="home" color="primary" iconStyle="contained" size={7} />
//       )}
//       right={() => <Icon variant="svg" icon="shop" color="primary" size={7} />}></List.Item>
//   </List.Accordion>
// </List>
