/* eslint-disable react/no-unstable-nested-components */
import React, { useRef, useState } from 'react';
import {
    Badge,
    Box,
    Button,
    Center,
    Clickable,
    ContentSafeAreaView,
    Header,
    HStack,
    IconButton,
    Screen,
    ServiceCard,
    Text,
} from '@/components';
import CreatePost from '@/components/organism/CreatePost';
import CreateService from '@/components/organism/CreateService';
import FindService from '@/components/organism/FindService';
import useHeader from '@/hooks/useHeader';
import { useGetServicesQuery } from '@/store/apiSlice';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetScrollView,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import { ActivityIndicator } from 'react-native';
import { vs } from 'react-native-size-matters';

export const HomeScreen = () => {
    const [selectedFilter, setSelectedFilter] = useState<'create' | 'find'>('create');
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const HomeHeader = () => (
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

    useHeader(HomeHeader);
    const { data, isLoading, error } = useGetServicesQuery();

    if (isLoading) {
        return (
            <Box justifyContent="center" alignItems="center" flex={1}>
                <ActivityIndicator size="large" />
            </Box>
        );
    }

    const filteredData = data?.results?.filter((item) => item?.type === selectedFilter);

    const openBottomSheet = () => {
        bottomSheetModalRef.current?.present();
    };

    console.log(data, error, 'what is data');

    const renderBottomSheetContent = () => (
        <BottomSheetView style={{ paddingBottom: 20, flex: 1 }}>
            <HStack justifyContent="center" g={10} alignItems="center">
                <Center>
                    <IconButton
                        iconStyle={selectedAction === 'post' ? 'contained' : 'outlined'}
                        size={8}
                        color="primary"
                        variant="vector"
                        icon="paper-plane"
                        type="entypo"
                        onPress={() => setSelectedAction('post')}
                    />
                    <Text color="primary">Post</Text>
                </Center>
                <Center>
                    <IconButton
                        iconStyle={selectedAction === 'service' ? 'contained' : 'outlined'}
                        color="primary"
                        size={8}
                        variant="vector"
                        icon="pencil"
                        type="entypo"
                        onPress={() => setSelectedAction('service')}
                    />
                    <Text color="primary">Service</Text>
                </Center>
                <Center>
                    <IconButton
                        iconStyle={selectedAction === 'find' ? 'contained' : 'outlined'}
                        size={8}
                        color="primary"
                        variant="vector"
                        icon="search"
                        type="feather"
                        onPress={() => setSelectedAction('find')}
                    />
                    <Text color="primary">Find</Text>
                </Center>
            </HStack>

            <BottomSheetScrollView>
                {selectedAction === 'post' && <CreatePost />}
                {selectedAction === 'service' && <CreateService />}
                {selectedAction === 'find' && <FindService />}
            </BottomSheetScrollView>
        </BottomSheetView>
    );

    return (
        <Screen>
            <Box bg="primary" py={5} px={5}>
                <Box
                    width="100%"
                    height={vs(35)}
                    borderRadius="rounded-sm"
                    bg="white"
                    justifyContent="center"
                    paddingHorizontal={3}
                >
                    <Clickable height="100%" justifyContent="center" onPress={() => openBottomSheet()}>
                        <Text>What's on your mind?</Text>
                    </Clickable>
                </Box>
            </Box>
            <ContentSafeAreaView my={5}>
                <HStack g={2}>
                    <Button
                        flex={1}
                        size="sm"
                        type={selectedFilter === 'create' ? 'contained' : 'outlined'}
                        onPress={() => setSelectedFilter('create')}
                    >
                        <Button.Text title="Providers" />
                    </Button>
                    <Button
                        flex={1}
                        size="sm"
                        type={selectedFilter === 'find' ? 'contained' : 'outlined'}
                        onPress={() => setSelectedFilter('find')}
                    >
                        <Button.Text title="Seekers" />
                    </Button>
                </HStack>
            </ContentSafeAreaView>
            <FlashList
                contentContainerStyle={{ paddingTop: 10 }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={filteredData}
                ItemSeparatorComponent={() => <Box mb={5} />}
                renderItem={({ item }: { item: any }) => <ServiceCard service={item} />}
                keyExtractor={(item) => item._id ?? item.id}
                estimatedItemSize={200}
            />

            <BottomSheetModalProvider>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={0}
                    snapPoints={['70%', '90%']}
                    onDismiss={() => setSelectedAction(null)}
                >
                    {renderBottomSheetContent()}
                </BottomSheetModal>
            </BottomSheetModalProvider>
        </Screen>
    );
};

export default HomeScreen;


