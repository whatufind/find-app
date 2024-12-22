import { Badge, Box, Button, Card, Center, ContentSafeAreaView, FastImage, Header, HStack, IconButton, Screen, Text, VStack } from '@/components';
import useHeader from '@/hooks/useHeader';
import { RootState } from '@/store/store';
import { getImage } from '@assets/constants/images';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const AccountHeader = () => {
    return (
        <Header>
            <Header.Content title="WF" subTitle="Hi Ibrahim, Good Morning" />
            <HStack>
                <Badge content="0" placement="topRight" variant="danger">
                    <IconButton variant="vector" icon="notifications" color="white" size={10} type="ionicon" />
                </Badge>
                <IconButton variant="vector" icon="setting" color="white" size={10} type="ant" />
            </HStack>
        </Header>
    );
};

export const AccountScreen = () => {
    useHeader(AccountHeader);

    const { userId } = useSelector((state: RootState) => state.user);

    // Define state for filter

    // Define filter options
    const filterOptions = ['Services', 'Posts', 'Requesters'];
    const [activeFilter, setActiveFilter] = useState<string>(filterOptions[0]);

    const renderFilteredContent = () => {
        switch (activeFilter) {
            case 'Services':
                return <Text textAlign="center">Showing Services Data...</Text>;
            case 'Posts':
                return <Text textAlign="center">Showing Posts Data...</Text>;
            case 'Requesters':
                return <Text textAlign="center">Showing Requesters Data...</Text>;
            default:
                return <Text textAlign="center">Showing All Data...</Text>;
        }
    };

    return (
        <Screen >
            {/* Header Section */}
            <Box width="100%" bg="primary" paddingVertical={10} borderBottomLeftRadius="rounded-lg" borderBottomRightRadius="rounded-lg">
                <Center>
                    <Box alignItems="center" width={50} height={50} borderRadius="rounded-full" justifyContent="center" backgroundColor="white">
                        <FastImage width={20} height={20} source={getImage('avatar')} />
                    </Box>
                    <Text variant="heading3" color="white">Ibrahim Khan</Text>
                    <Text variant="heading3" color="white">(Farmer)</Text>
                </Center>
            </Box>

            {/* Tab Button Filter */}
            <ContentSafeAreaView>
                <HStack g={5} mt={10}>
                    <Card variant="outlined" flex={1} padding={5}>
                        <Text variant="heading2" textAlign="center">10</Text>
                        <Text textAlign="center">Services</Text>
                    </Card>
                    <Card variant="outlined" flex={1} padding={5}>
                        <Text variant="heading2" textAlign="center">100</Text>
                        <Text textAlign="center">Posts</Text>
                    </Card>
                </HStack>
                <HStack g={5} mt={5}>
                    <Card variant="outlined" flex={1} padding={5}>
                        <Text variant="heading2" textAlign="center">10</Text>
                        <Text textAlign="center">Requesters</Text>
                    </Card>
                    <Card variant="outlined" flex={1} padding={5}>
                        <Text variant="heading2" textAlign="center">5</Text>
                        <Text textAlign="center">Order completed</Text>
                    </Card>
                </HStack>

                <HStack justifyContent="center" g={4} mt={10}>
                    {filterOptions.map((filter) => (
                        <Button
                            flex={1}
                            key={filter}
                            type={filter === activeFilter ? 'contained' : 'outlined'}
                            onPress={() => setActiveFilter(filter)}
                        >
                            <Text color={filter === activeFilter ? 'white' : 'primary'}>{filter}</Text>
                        </Button>
                    ))}
                </HStack>

                {/* Filtered Content */}
                <VStack mt={5}>
                    {renderFilteredContent()}
                </VStack>
            </ContentSafeAreaView>
        </Screen >
    );
};

export default AccountScreen;
