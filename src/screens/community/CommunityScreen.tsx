import { StyleSheet } from 'react-native';
import React from 'react';
import { useGetPostsQuery } from '@/store/apiSlice';
import PostCard from '@/components/organism/PostCard';
import { Header, HStack, IconButton, Badge, Screen, ContentSafeAreaView, Box } from '@/components';
import useHeader from '@/hooks/useHeader';
import { FlashList } from '@shopify/flash-list';


const CommunityHeader = () => (
    <Header>
        <Header.Content title="WF" subTitle="Hi Ibrahim, Good Morning" />
        <HStack>
            <IconButton variant="vector" icon="search" color="white" size={10} type="feather" />
            <Badge content="0" placement="topRight" variant="danger">
                <IconButton variant="vector" icon="notifications" color="white" size={10} type="ionicon" />
            </Badge>
        </HStack>
    </Header>
);

export const CommunityScreen = () => {
    useHeader(CommunityHeader);
    const { data } = useGetPostsQuery();
    return (
        <Screen >
            <ContentSafeAreaView flex={1}>
                <FlashList
                    contentContainerStyle={{ paddingTop: 10 }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={data?.results}
                    ItemSeparatorComponent={() => <Box mb={5} />}
                    renderItem={({ item }: { item: any }) => <PostCard post={item} />}
                    keyExtractor={(item) => item._id ?? item.id}
                    estimatedItemSize={200}
                />

            </ContentSafeAreaView>
        </Screen>
    );
};

export default CommunityScreen;

