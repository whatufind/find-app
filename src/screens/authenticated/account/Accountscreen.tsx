/* eslint-disable react/no-unstable-nested-components */
import { Badge, Box, Card, Center, ContentSafeAreaView, FastImage, Header, HStack, IconButton, Screen, Text, VStack } from '@/components';
import PersonalServiceCard from '@/components/organism/PersonalServiceCard';
import useHeader from '@/hooks/useHeader';
import { useGetServiceRequestersQuery, useGetServicesQuery, useGeUserQuery } from '@/store/apiSlice';
import { RootState } from '@/store/store';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { useSelector } from 'react-redux';


export const AccountScreen = () => {
    const { userId } = useSelector((state: RootState) => state.user);
    const {data:user,isLoading,error} = useGeUserQuery({userId});
    const {data:services,isLoading:isServiceLoading,error:serviceErr} = useGetServicesQuery({user:userId,sortBy:'-createdAt'});

    const AccountHeader = () => {
        return (
            <Header>
                <Header.Content title="WF" subTitle={`Hi ${user?.name}, Good Morning`} />
                <HStack>
                    <Badge content="0" placement="topRight" variant="danger">
                        <IconButton variant="vector" icon="notifications" color="white" size={10} type="ionicon" />
                    </Badge>
                    <IconButton variant="vector" icon="setting" color="white" size={10} type="ant" />
                </HStack>
            </Header>
        );
    };

    useHeader(AccountHeader);

    return (
        <Screen >
            {/* Header Section */}
            <Box width="100%" bg="primary" paddingVertical={10} borderBottomLeftRadius="rounded-lg" borderBottomRightRadius="rounded-lg">
                <Center>
                    <Box alignItems="center" width={50} height={50} borderRadius="rounded-full" justifyContent="center" backgroundColor="white">
                        <FastImage width={20} height={20} source={{uri:user?.profilePicture}} />
                    </Box>
                    <Text variant="heading3" color="white">{user?.name}</Text>
                    <Text variant="heading3" color="white">{user?.professions?.[0]}</Text>
                </Center>
            </Box>

            {/* Tab Button Filter */}
            <ContentSafeAreaView flex={1}>
                <HStack g={5} mt={2}>
                    <Card variant="outlined" flex={1} padding={5}>
                        <Text variant="heading2" textAlign="center">{services?.results?.length}</Text>
                        <Text textAlign="center">Services</Text>
                    </Card>

                    <Card variant="outlined" flex={1} padding={5}>
                        <Text variant="heading2" textAlign="center">10</Text>
                        <Text textAlign="center">Requesters</Text>
                    </Card>
                    <Card variant="outlined" flex={1} padding={5}>
                        <Text variant="heading2" textAlign="center">5</Text>
                        <Text textAlign="center">Order completed</Text>
                    </Card>
                </HStack>

                {/* Filtered Content */}
                <VStack mt={5} flex={1}>
                <FlashList
                ListEmptyComponent={()=><Text textAlign="center" mt={3} variant="heading3" color="black">No Service Found</Text>}
                  contentContainerStyle={{paddingTop: 10}}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  data={services?.results}
                  ItemSeparatorComponent={() => <Box mb={5} />}
                  renderItem={({item}: {item: any}) => <PersonalServiceCard service={item} />}
                  keyExtractor={item => item._id ?? item.id}
                  estimatedItemSize={200}
                />
                </VStack>
            </ContentSafeAreaView>
        </Screen >
    );
};

export default AccountScreen;
