/* eslint-disable react/no-unstable-nested-components */
import {
  Box,
  Button,
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
import {getImageUrl} from '@/helper/image';
import useHeader from '@/hooks/useHeader';
import {
  useGetServiceRequestersQuery,
  useGetServicesQuery,
  useGeUserQuery,
} from '@/store/apiSlice';
import {RootState} from '@/store/store';
import theme from '@/theme';
import {
  DrawerActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import React, {useCallback} from 'react';
import {ImageBackground, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';

const AccountHeader = ({user}) => {
  const navigation = useNavigation();
  return (
    <Header>
      <Header.Content title="WF" />
      <HStack>
        <IconButton
          variant="vector"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          icon="setting"
          color="white"
          size={10}
          type="ant"
        />
      </HStack>
    </Header>
  );
};

const ProfileSection = ({user}) => {
  const navigation = useNavigation();
  return (
    <ImageBackground
      source={{uri: getImageUrl(user?.coverPhoto)}}
      style={styles.imageBanner}>
      <Center>
        <Box position="absolute" zIndex={10} top={0} right={-10}>
          <IconButton
            onPress={() => navigation.navigate('Manage Account')}
            size={10}
            icon="pencil-circle"
            variant="vector"
            type="materialCommunity"
          />
        </Box>
        <FastImage
          borderRadius="rounded-full"
          width={100}
          height={100}
          source={{uri: getImageUrl(user?.profilePicture)}}
        />
        <Text variant="heading3" color="primary">
          {user?.name}
        </Text>
        <Text variant="b4regular" color="primary">
          {user?.professions?.[0]?.name}
        </Text>
      </Center>
    </ImageBackground>
  );
};

const StatsCard = ({value, label}) => (
  <Card
    variant="outlined"
    borderRadius="rounded-full"
    flexDirection="row"
    borderColor="primary"
    borderWidth={2}
    alignItems="center"
    gap={2}
    paddingHorizontal={5}>
    <Text variant="b3semiBold" color="primary" textAlign="center">
      {value}
    </Text>
    <Text textAlign="center" color="primary" variant="b3semiBold">
      {label}
    </Text>
  </Card>
);

export const AccountScreen = () => {
  const {userId, accessToken} = useSelector((state: RootState) => state.user);
  const navigation = useNavigation();
  const {data: user, isLoading: isUserLoading} = useGeUserQuery({userId});
  const {
    data: services,
    isLoading: isServicesLoading,
    error,
    refetch,
  } = useGetServicesQuery({user: userId, sortBy: '-createdAt'});
  const {data: requests, isLoading: isRequestsLoading} =
    useGetServiceRequestersQuery({owner: userId});
  useHeader(() => <AccountHeader user={user} />);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );


  if (!accessToken) {
    return(<Screen>
      <ContentSafeAreaView alignItems="center" justifyContent="center" flex={1}>
        <Box g={5}>
          <Text textAlign="center" color="danger">You are not logged in yet. Please login to continue</Text>
          <Button
          onPress={()=>navigation.navigate('Login')}
          >
            <Button.Text title="Go to login" />
          </Button>
        </Box>
      </ContentSafeAreaView>
    </Screen>);
  }

  if (isUserLoading || isServicesLoading || isRequestsLoading) {
    return (
      <Center>
        <Text variant="heading3">Loading...</Text>
      </Center>
    );
  }

  return (
    <Screen background="white">
      <ProfileSection user={user} />
      <ContentSafeAreaView flex={1}>
        <HStack g={5} mt={5} justifyContent="center" px={5}>
          <StatsCard value={services?.results?.length || 0} label="Services" />
          <StatsCard value={requests?.results?.length || 0} label="Requests" />
          <StatsCard value={5} label="Completed" />
        </HStack>
        <VStack mt={5} flex={1}>
          <FlashList
            ListEmptyComponent={() => (
              <Text textAlign="center" mt={3} variant="heading3" color="black">
                No Service Found
              </Text>
            )}
            contentContainerStyle={{paddingTop: 10}}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={services?.results}
            ItemSeparatorComponent={() => <Box mb={5} />}
            renderItem={({item}) => <PersonalServiceCard service={item} />}
            keyExtractor={item => item._id ?? item.id}
            estimatedItemSize={200}
          />
        </VStack>
      </ContentSafeAreaView>
    </Screen>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  imageBanner: {
    width: theme.sizes.width,
    height: theme.sizes.width / 2.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
