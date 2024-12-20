/* eslint-disable react/no-unstable-nested-components */
import { Box, ContentSafeAreaView, Header, IconButton, Input, Screen, ServiceCard } from '@/components';
import services from '@/data/service.json';
import useHeader from '@/hooks/useHeader';
import { useGetServicesQuery } from '@/store/apiSlice';
import { RootState } from '@/store/store';
import { serviceType } from '@/types/service';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';

export const HomeScreen = () => {
    const token = useSelector((state: RootState) => state.user);
    console.log(token, 'token at home page');
    const HomeHeader = () => {
        return <Header>
            <Header.Content title="Hi Ibrahim" subTitle="Good morning" />
            <Header.Action icon="notification" variant="svg" color="white" size={10} />
        </Header>;
    };

    useHeader(HomeHeader);


    const { data, isLoading, error } = useGetServicesQuery();
    console.log(error);
    if (isLoading) {
        return <Box justifyContent="center" alignItems="center" flex={1}>
            <ActivityIndicator size="large" />
        </Box>;
    }
    return (
        <Screen safeAreaEdges={['top']} >

            <Box bg="primary" py={5} px={5}>
                <Input placeholder="Find what you need!" right={() => <IconButton variant="vector" icon="search" color="primary" type="feather" />} />
            </Box>
            <FlashList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={data?.results}
                ItemSeparatorComponent={() => <Box mb={5} />}
                renderItem={({ item }: { item: any }) => <ServiceCard service={item} />}
                keyExtractor={(item) => item._id ?? item.id}
                estimatedItemSize={200}
            />
        </Screen>
    );
};

export default HomeScreen;
