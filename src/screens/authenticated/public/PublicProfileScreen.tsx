import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
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
import {getImageUrl} from '@/helper/image';
import useHeader from '@/hooks/useHeader';
import {useGetServicesQuery, useGeUserQuery} from '@/store/apiSlice';
import {RootState} from '@/store/store';
import theme from '@/theme';
import {FlashList} from '@shopify/flash-list';
import PersonalServiceCard from '@/components/organism/PersonalServiceCard';
import {useNavigation} from '@react-navigation/native';

const PublicProfileScreenHeader = () => <Box />;

const ProfileHeader = ({user}) => {
  const navigation = useNavigation();
  return (
    <Box height={theme.sizes.safeWidth / 1.5}>
      <Box position="absolute" zIndex={20} top={40} left={20}>
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
      <ContentSafeAreaView position="absolute" bottom={0}>
        <HStack g={5} alignItems="center">
          <FastImage
            borderRadius="rounded-full"
            borderWidth={3}
            borderColor="white"
            width={s(70)}
            height={s(70)}
            source={{uri: getImageUrl(user?.profilePicture)}}
          />
          <HStack justifyContent="space-between" flex={1} mt={8}>
            <VStack>
              <Text variant="b1bold">{user?.name}</Text>
              <Text variant="b3semiBold">{user?.professions?.[0]?.name}</Text>
              <Text variant="b4regular">Dhaka, Bangladesh</Text>
            </VStack>
            <HStack>
              <Button size="sm" height={s(20)} px={5}>
                <Button.Text title="Follow" />
              </Button>
              <IconButton
                icon="chatbubble-ellipses-outline"
                type="ionicon"
                variant="vector"
              />
              <IconButton icon="phone" type="ant" variant="vector" />
            </HStack>
          </HStack>
        </HStack>
      </ContentSafeAreaView>
    </Box>
  );
};

const ProfileTabs = ({tabs, activeTab, setActiveTab}) => (
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

const ProfileDetails = ({user}) => (
  <Box g={3} backgroundColor="white" borderRadius="rounded-sm" mt={5} p={5}>
    {[
      {label: 'Nationality:', value: 'Bangladeshi'},
      {label: 'Location:', value: 'Dhaka, Bangladesh'},
      {label: 'Contact Number:', value: user?.phone},
      {label: 'Primary Profession:', value: user?.professions?.[0]?.name},
    ].map(({label, value}) => (
      <HStack g={3} key={label}>
        <Text color="black" variant="b3bold">
          {label}
        </Text>
        <Text>{value}</Text>
      </HStack>
    ))}
  </Box>
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

const Reviews = () => (
  <Box p={5} backgroundColor="white" borderRadius="rounded-sm" mt={5}>
    <Text variant="b3bold">User reviews coming soon...</Text>
  </Box>
);

export const PublicProfileScreen = () => {
  const {userId} = useSelector((state: RootState) => state.user);
  const {data: user} = useGeUserQuery({userId});
  const tabs = ['About', 'Top services', 'Reviews'];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  useHeader(PublicProfileScreenHeader);

  return (
    <Screen>
      <ProfileHeader user={user} />
      <ContentSafeAreaView>
        {user?.about && (
          <Text textAlign="center" variant="b5regular" mt={4}>
            Bio: {user.about}
          </Text>
        )}
      </ContentSafeAreaView>
      <Divider borderColor="neutral100" my={5} />
      <ContentSafeAreaView flex={1}>
        <ScrollView style={{flexGrow: 0}}>
          <ProfileTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </ScrollView>
        {activeTab === 'About' && <ProfileDetails user={user} />}
        {activeTab === 'Top services' && <Services user={user} />}
        {activeTab === 'Reviews' && <Reviews />}
      </ContentSafeAreaView>
    </Screen>
  );
};

export default PublicProfileScreen;
