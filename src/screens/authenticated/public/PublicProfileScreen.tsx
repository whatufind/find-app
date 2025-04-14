import {
  Box,
  Button,
  ContentSafeAreaView,
  Divider,
  FastImage,
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
  useCreateChatMutation,
  useFollowUserMutation,
  useGetFollowersQuery,
  useGetServicesQuery,
  useGeUserQuery,
} from '@/store/apiSlice';
import { RootState } from '@/store/store';
import theme from '@/theme';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React, { useEffect, useState } from 'react';
import { Linking, ScrollView } from 'react-native';
import { s, vs } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const PublicProfileScreenHeader = () => <Box />;

const ProfileHeader = ({ user }) => {
  const [createChat, { isLoading }] = useCreateChatMutation();
  const navigation = useNavigation();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followUser, { isLoading: isFollowLoading }] = useFollowUserMutation();
  const { data: followers, refetch: refetchFollowers } = useGetFollowersQuery(user?.id);
  const { userId } = useSelector((state: RootState) => state.user);

  const handleCreateChat = async () => {
    try {
      const data = await createChat({ userId: user.id }).unwrap();
      const target = data?.users.find(tUser => tUser.id === user?.id);
      navigation.navigate('Chat', { user: target, chatId: data?._id });
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleFollow = async () => {
    try {
      const data = await followUser({ id: user?.id }).unwrap();
      if (data) {
        refetchFollowers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsFollowing(followers?.followers?.find((f) => f?.id === userId) ? true : false);
  }, [followers]);

  return (
    <Box height={theme.sizes.safeWidth / 2} >
      <Box position="absolute" zIndex={10} top={20} left={10}
      >
        <IconButton
          onPress={() => navigation.goBack()}
          icon="chevron-left"
          backgroundColor="white"
          type="feather"
          variant="vector"
        />
      </Box>
      <FastImage
        source={{ uri: getImageUrl(user?.coverPhoto) }}
        width={theme.sizes.width}
        height={theme.sizes.safeWidth / 2}
      />
      <FastImage
        borderRadius="rounded-full"
        borderWidth={3}
        borderColor="white"
        width={s(70)}
        height={s(70)}
        source={{ uri: getImageUrl(user?.profilePicture) }}
      />
      <HStack g={5} alignItems="center">

        <HStack justifyContent="space-between" flex={1} >
          <VStack>
            <Text variant="b1bold">{user?.name}</Text>
            <Text variant="b3semiBold">{user?.professions?.[0]?.name}</Text>
          </VStack>
          <HStack>
            <Button size="sm" height={s(20)} px={5}
              onPress={handleFollow}
            >
              <Button.Text title={isFollowing ? 'Following' : 'Follow'} />
            </Button>
            <IconButton
              onPress={() => handleCreateChat()}
              icon="chatbubble-ellipses-outline"
              type="ionicon"
              variant="vector"
            />
            <IconButton
              onPress={() => Linking.openURL(`tel:${user?.phone}`)}

              icon="phone" type="ant" variant="vector" />
          </HStack>
        </HStack>
      </HStack>
      {user?.about && (
        <Text textAlign="center" variant="b5regular" mt={4}>
          Bio: {user.about}
        </Text>
      )}

    </Box>
  );
};

const ProfileTabs = ({ tabs, activeTab, setActiveTab }) => (
  <HStack g={5} mt={3}>
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

const Services = ({ user }) => {
  const { data: services, isLoading: isServicesLoading } = useGetServicesQuery({
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
  );
};

const Reviews = () => (
  <Box p={5} backgroundColor="white" borderRadius="rounded-sm" mt={5}>
    <Text variant="b3bold">User reviews coming soon...</Text>
  </Box>
);

export const PublicProfileScreen = ({ route }) => {
  const { data: user } = useGeUserQuery({ userId: route?.params?.id });
  const tabs = ['Location', 'Top services', 'Reviews'];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const { latitude, longitude } = useSelector((state: RootState) => state.location);


  useHeader(PublicProfileScreenHeader);
  return (
    <Screen >
      <ProfileHeader user={user} />
      <ContentSafeAreaView flex={1}>
        <ScrollView >
          <ProfileTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </ScrollView>
        {activeTab === 'Top services' && <Services user={user} />}
        {activeTab === 'Reviews' && <Reviews />}

        {(user?.location && activeTab === 'Location') ? (
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
            }}
          >
            <Marker
              coordinate={{
                latitude: user?.location?.latitude,
                longitude: user?.location?.longitude,

              }}
              title="Your Location"
              description="This is your current position"
            />
          </MapView>
        ) : null}

      </ContentSafeAreaView>
    </Screen>
  );
};

export default PublicProfileScreen;
