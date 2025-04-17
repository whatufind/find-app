/* eslint-disable react/no-unstable-nested-components */
import {
  Box,
  Button,
  Card,
  Center,
  Clickable,
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
import RequestCard from '../request/RequestCard';

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
      <Box
        width="100%"
        height="100%"
        bg="backdrop"
        alignItems="center"
        justifyContent="center">
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
          <Text textAlign="center" variant="heading3" color="white">
            {user?.name}
          </Text>
          <Text textAlign="center" variant="b4regular" color="white">
            {user?.professions?.[0]?.name}
          </Text>
        </Center>
      </Box>
    </ImageBackground>
  );
};

const StatsCard = ({value, label, onPress, isSelected}) => (
  <Clickable
    onPress={onPress}
    borderRadius="rounded-full"
    bg={isSelected ? 'primary' : 'white'}
    borderColor="primary"
    borderWidth={2}
    px={5}
    alignItems="center">
    <Text color={isSelected ? 'white' : 'primary'} textAlign="center">
      {value} {label}
    </Text>
  </Clickable>
);

export const AccountScreen = () => {
  const {userId, accessToken} = useSelector((state: RootState) => state.user);
  const navigation = useNavigation();
  const {data: user, isLoading: isUserLoading} = useGeUserQuery({userId});
  const [selectedTab, setSelectedTab] = React.useState<'services' | 'requests'>(
    'services',
  );

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
    return (
      <Screen>
        <ContentSafeAreaView
          alignItems="center"
          justifyContent="center"
          flex={1}>
          <Box g={5}>
            <Text textAlign="center" color="danger">
              You are not logged in yet. Please login to continue
            </Text>
            <Button onPress={() => navigation.navigate('Login')}>
              <Button.Text title="Go to login" />
            </Button>
          </Box>
        </ContentSafeAreaView>
      </Screen>
    );
  }

  if (isUserLoading || isServicesLoading || isRequestsLoading) {
    return (
      <Center>
        <Text variant="heading3">Loading...</Text>
      </Center>
    );
  }

  console.log(requests);

  return (
    <Screen background="white">
      <ProfileSection user={user} />
      <ContentSafeAreaView flex={1}>
        <HStack g={5} mt={5}>
          <StatsCard
            value={services?.results?.length || 0}
            label="Services"
            onPress={() => setSelectedTab('services')}
            isSelected={selectedTab === 'services'}
          />
          <StatsCard
            value={requests?.results?.length || 0}
            label="Requests"
            onPress={() => setSelectedTab('requests')}
            isSelected={selectedTab === 'requests'}
          />
        </HStack>

        <VStack mt={5} flex={1}>
          {selectedTab === 'services' ? (
            <FlashList
              ListEmptyComponent={() => (
                <Text
                  textAlign="center"
                  mt={3}
                  variant="heading3"
                  color="black">
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
          ) : null}

          {selectedTab === 'requests' ? (
            <FlashList
              ListEmptyComponent={() => (
                <Text
                  textAlign="center"
                  mt={3}
                  variant="heading3"
                  color="black">
                  No Requesters found
                </Text>
              )}
              contentContainerStyle={{paddingTop: 10}}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={requests?.results}
              extraData={[1]}
              ItemSeparatorComponent={() => <Box mb={5} />}
              renderItem={({item}) => <RequestCard request={item} />}
              keyExtractor={item => item._id ?? item.id}
              estimatedItemSize={200}
            />
          ) : null}
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
