/* eslint-disable react/no-unstable-nested-components */
import { Box, ContentSafeAreaView, Header, Icon, IconButton, Input, Screen, ServiceCard } from '@/components';
import services from '@/data/service.json';
import useHeader from '@/hooks/useHeader';
import { serviceType } from '@/types/service';
import { FlashList } from '@shopify/flash-list';
import React from 'react';

export const HomeScreen = () => {
    const HomeHeader = () => {
        return <Header>
            <Header.Content title="Hi Ibrahim" subTitle="Good morning" />
            <Header.Action icon="notification" variant="svg" />
        </Header>;
    };

    useHeader(HomeHeader);
    return (
        <Screen safeAreaEdges={['top']} >

            <ContentSafeAreaView my={5}>
                <Box>
                    <Input placeholder="Find what you need!" right={() => <IconButton variant="vector" icon="search" color="primary" type="feather" />} />
                </Box>
            </ContentSafeAreaView>
            <FlashList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={services}
                ItemSeparatorComponent={() => <Box mb={5} />}
                renderItem={({ item }: { item: serviceType }) => <ServiceCard service={item} />}
                keyExtractor={(item) => item.name}
                estimatedItemSize={200}
            />
        </Screen>
    );
};

export default HomeScreen;
