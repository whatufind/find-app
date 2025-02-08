/* eslint-disable react/no-unstable-nested-components */
import {
    Badge,
    Box,
    Card,
    Center,
    ContentSafeAreaView,
    FastImage,
    Header,
    HStack,
    IconButton,
    Screen,
    Text,
    VStack,
} from '@/components';
import PersonalServiceCard from '@/components/organism/PersonalServiceCard';
import { getImageUrl } from '@/helper/image';
import useHeader from '@/hooks/useHeader';
import {
    useGetServiceRequestersQuery,
    useGetServicesQuery,
    useGeUserQuery,
} from '@/store/apiSlice';
import { RootState } from '@/store/store';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { useSelector } from 'react-redux';

const AccountHeader = ({ user }) => {
    const navigation = useNavigation();
    return ( <Header>
        <Header.Content title="WF" subTitle={`Hi ${user?.name}, Good Morning`} />
        <HStack>
          <Badge content="0" placement="topRight" variant="danger">
            <IconButton variant="vector" icon="notifications" color="white" size={10} type="ionicon" />
        </Badge>
          <IconButton variant="vector"
          onPress={()=>navigation.dispatch(DrawerActions.openDrawer())}
          icon="setting" color="white" size={10} type="ant" />
        </HStack>
      </Header>);
};

const ProfileSection = ({ user }) => (
  <Box
    width="100%"
    bg="primary"
    paddingVertical={10}
    borderBottomLeftRadius="rounded-lg"
    borderBottomRightRadius="rounded-lg"
  >
    <Center>
      <Box alignItems="center" overflow="hidden" width={50} height={50} borderRadius="rounded-full" justifyContent="center" backgroundColor="white">
        <FastImage width={50} height={50} source={{ uri: getImageUrl(user?.profilePicture) }} />
      </Box>
      <Text variant="heading3" color="white">{user?.name}</Text>
      <Text variant="heading3" color="white">{user?.professions?.[0]?.name}</Text>
    </Center>
  </Box>
);

const StatsCard = ({ value, label }) => (
  <Card
    variant="outlined"
    borderRadius="rounded-full"
    flexDirection="row"
    borderColor="primary"
    borderWidth={2}
    alignItems="center"
    gap={2}
    paddingHorizontal={5}
  >
    <Text variant="b2bold" color="primary" textAlign="center">{value}</Text>
    <Text textAlign="center" color="primary" variant="b2bold">{label}</Text>
  </Card>
);

export const AccountScreen = () => {
  const { userId } = useSelector((state: RootState) => state.user);
  const { data: user, isLoading: isUserLoading } = useGeUserQuery({ userId });
  const { data: services, isLoading: isServicesLoading } = useGetServicesQuery({ user: userId, sortBy: '-createdAt' });
  const { data: requests, isLoading: isRequestsLoading } = useGetServiceRequestersQuery({ owner: userId });

  useHeader(() => <AccountHeader user={user} />);

  if (isUserLoading || isServicesLoading || isRequestsLoading) {
    return <Center><Text variant="heading3">Loading...</Text></Center>;
  }

  return (
    <Screen>
      <ProfileSection user={user} />
      <ContentSafeAreaView flex={1}>
        <HStack g={5} mt={5} justifyContent="center">
          <StatsCard value={services?.results?.length || 0} label="Services" />
          <StatsCard value={requests?.results?.length || 0} label="Requesters" />
          <StatsCard value={5} label="Completed" />
        </HStack>
        <VStack mt={5} flex={1}>
          <FlashList
            ListEmptyComponent={() => <Text textAlign="center" mt={3} variant="heading3" color="black">No Service Found</Text>}
            contentContainerStyle={{ paddingTop: 10 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={services?.results}
            ItemSeparatorComponent={() => <Box mb={5} />}
            renderItem={({ item }) => <PersonalServiceCard service={item} />}
            keyExtractor={item => item._id ?? item.id}
            estimatedItemSize={200}
          />
        </VStack>
      </ContentSafeAreaView>
    </Screen>
  );
};

export default AccountScreen;
