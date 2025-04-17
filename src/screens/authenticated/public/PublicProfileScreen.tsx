/* eslint-disable react/no-unstable-nested-components */
import {
  Box,
  Button,
  Card,
  Center,
  ContentSafeAreaView,
  FastImage,
  HStack,
  Icon,
  IconButton,
  Screen,
  Text,
  VStack,
} from '@/components';
import PersonalServiceCard from '@/components/organism/PersonalServiceCard';
import {getImageUrl} from '@/helper/image';
import useHeader from '@/hooks/useHeader';
import {
  useCreateChatMutation,
  useFollowUserMutation,
  useGetFollowersQuery,
  useGetServicesQuery,
  useGetServieReviewsQuery,
  useGeUserQuery,
  useUnFollowUserMutation,
} from '@/store/apiSlice';
import {RootState} from '@/store/store';
import theme from '@/theme';
import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import React, {useEffect, useState} from 'react';
import {Linking, ScrollView} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {s, vs} from 'react-native-size-matters';
import {useSelector} from 'react-redux';

const PublicProfileScreenHeader = () => <Box />;

const ProfileTabs = ({tabs, activeTab, setActiveTab}) => (
  <HStack g={5} mt={5}>
    {tabs.map(tab => (
      <Button
        variant={activeTab === tab ? 'black' : 'white'}
        size="sm"
        height={vs(17)}
        px={5}
        key={tab}
        onPress={() => setActiveTab(tab)}>
        <Button.Text title={tab} />
      </Button>
    ))}
  </HStack>
);

const Services = ({user}) => {
  const {data: services, isLoading: isServicesLoading} = useGetServicesQuery({
    user: user?.id,
    sortBy: '-createdAt',
  });
  return (
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
  );
};



export const PublicProfileScreen = ({route}) => {
  const {data: user} = useGeUserQuery({userId: route?.params?.id});
    const {data: reviewsData} = useGetServieReviewsQuery({owner: route?.params?.id,sortBy:'-createdAt'},{skip:!route?.params?.id});
  const tabs = ['Top services', 'Location', 'Reviews'];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const {latitude, longitude} = useSelector(
    (state: RootState) => state.location,
  );
  const [createChat, {isLoading}] = useCreateChatMutation();
  const navigation = useNavigation();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followUser, {isLoading: isFollowLoading}] = useFollowUserMutation();
  const [unFollowUser, {isLoading: isUnFollowLoading}] =
    useUnFollowUserMutation();
  const {data: followers, refetch: refetchFollowers} = useGetFollowersQuery(
    user?.id,
  );
  const {userId} = useSelector((state: RootState) => state.user);

  const handleCreateChat = async () => {
    try {
      const data = await createChat({userId: user.id}).unwrap();
      const target = data?.users.find(tUser => tUser.id === user?.id);
      navigation.navigate('Chat', {user: target, chatId: data?._id});
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleFollow = async () => {
    if (isFollowing) {
      try {
        const data = await unFollowUser({id: user?.id}).unwrap();
        if (data) {
          refetchFollowers();
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const data = await followUser({id: user?.id}).unwrap();
        if (data) {
          refetchFollowers();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    setIsFollowing(
      followers?.followers?.find(f => f?.id === userId) ? true : false,
    );
  }, [followers]);

  const ProfileHeader = ({user}) => {
    return (
      <Box>
        <Box height={theme.sizes.safeWidth / 2}>
          <Box
            position="absolute"
            zIndex={10}
            top={20}
            left={theme.sizes.sideSpace}>
            <IconButton
              onPress={() => navigation.goBack()}
              icon="chevron-left"
              backgroundColor="white"
              type="feather"
              variant="vector"
            />
          </Box>
          <FastImage
            source={{uri: getImageUrl(user?.coverPhoto)}}
            width={theme.sizes.width}
            height={theme.sizes.safeWidth / 2}
          />
          <Box
            position="absolute"
            bottom={-40}
            zIndex={20}
            left={theme.sizes.sideSpace}>
            <FastImage
              borderRadius="rounded-full"
              borderWidth={3}
              borderColor="white"
              width={s(70)}
              height={s(70)}
              source={{uri: getImageUrl(user?.profilePicture)}}
            />
          </Box>
          <HStack position="absolute" right={theme.sizes.sideSpace} bottom={0}>
            {userId === user?.id ? (
              <Button size="sm"
              marginBottom={3}
              height={s(20)} px={5}>
                <Button.Text
                  title={`${followers?.followers?.length} Followers`}
                />
              </Button>
            ) : (
              <Button
                gap={2}
                size="sm"
                height={s(20)}
                px={5}
                onPress={handleFollow}>
                {!isFollowing && (
                  <Icon
                    icon="add"
                    size={6}
                    variant="vector"
                    type="ionicon"
                    color="white"
                  />
                )}
                <Button.Text title={isFollowing ? 'Following' : 'Follow'} />
                {isFollowing && (
                  <Icon
                    icon="check"
                    size={6}
                    variant="vector"
                    type="feather"
                    color="white"
                  />
                )}
              </Button>
            )}
            {userId !== user?.id ?
            <>
            <IconButton
              onPress={() => handleCreateChat()}
              icon="chatbubble-ellipses-outline"
              type="ionicon"
              variant="vector"
            />
            <IconButton
              onPress={() => Linking.openURL(`tel:${user?.phone}`)}
              icon="phone"
              type="ant"
              variant="vector"
            />
            </>
            : null}
          </HStack>
        </Box>
        <Box
          bg="white"
          px={5}
          py={2}
          alignItems="center"
          borderBottomLeftRadius="rounded-md"
          borderBottomRightRadius="rounded-md">
          <Center>
            <Text variant="b1bold">{user?.name}</Text>
            <Text variant="b3semiBold">{user?.professions?.[0]?.name}</Text>
          </Center>

          {user?.about && (
            <Text textAlign="center" variant="b5medium" mt={4}>
              Bio: {user.about}
            </Text>
          )}
        </Box>
      </Box>
    );
  };


  const Reviews = () => (
   <Box flex={1} mt={5}>
     <FlashList
    data={reviewsData?.results}
    ListEmptyComponent={() => <Text>No reviews yet</Text>}
    ItemSeparatorComponent={() => <Box height={vs(10)} />}
    keyExtractor={item => item?.id}
    renderItem={({item}) => (
      <Card variant="outlined" padding={5}>
        <Box py={2} flexDirection="row" g={3} alignItems="center">
          <Box
            borderColor="primary"
            borderWidth={2}
            p={2}
            borderRadius="rounded-full">
            <FastImage
              style={{borderRadius: theme.borderRadii['rounded-full']}}
              width={s(25)}
              height={s(25)}
              source={{uri: item?.user?.profilePicture}}
            />
          </Box>
          <VStack>
            <Text variant="b2medium">{item?.user?.name}</Text>
            <HStack g={2}>
              {Array(Math.ceil(item?.rating))
                ?.fill(null)
                .map((_, index) => (
                  <Icon
                    key={index}
                    icon="star"
                    color="warning"
                    size={6}
                    type="ant"
                    variant="vector"
                  />
                ))}
            </HStack>
          </VStack>
        </Box>
        <Text variant="b3regular">{item?.comment}</Text>
      </Card>
    )}
    estimatedItemSize={43.3}
  />
   </Box>
  );


  useHeader(PublicProfileScreenHeader);
  return (
    <Screen>
      <ProfileHeader user={user} />
      <ContentSafeAreaView flex={1}>
        <Box>
          <ScrollView>
            <ProfileTabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </ScrollView>
        </Box>
        {activeTab === 'Top services' && <Services user={user} />}
        {activeTab === 'Reviews' && <Reviews />}

        {user?.location && activeTab === 'Location' ? (
          <Box
            width={theme.sizes.safeWidth}
            height={theme.sizes.safeWidth / 2}
            overflow="hidden"
            borderRadius="rounded-sm">
            <MapView
              style={{
                width: theme.sizes.safeWidth,
                height: theme.sizes.safeWidth / 2,
                marginVertical: 5,
                borderRadius: theme.borderRadii['rounded-md'],
                overflow: 'hidden',
              }}
              region={{
                latitude: user?.location?.latitude ?? 37.78825,
                longitude: user?.location?.longitude ?? -122.4324,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}>
              <Marker
                coordinate={{
                  latitude: user?.location?.latitude,
                  longitude: user?.location?.longitude,
                }}
                title="Your Location"
                description="This is your current position"
              />
            </MapView>
          </Box>
        ) : null}
      </ContentSafeAreaView>
    </Screen>
  );
};

export default PublicProfileScreen;
