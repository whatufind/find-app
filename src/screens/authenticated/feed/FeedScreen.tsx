import React from 'react';
import {FlatList, ActivityIndicator} from 'react-native';
import {
  Badge,
  Box,
  Divider,
  FastImage,
  Header,
  HStack,
  IconButton,
  Screen,
  Text,
} from '@/components';
import useHeader from '@/hooks/useHeader';
import {useGetChatsQuery} from '@/store/apiSlice';
import {getImageUrl} from '@/helper/image';
import {s} from 'react-native-size-matters';

// Header Component
const HomeHeader = () => (
  <Header>
    <Header.Content title="Chats" />
    <HStack>
      <IconButton
        variant="vector"
        icon="search"
        color="white"
        size={10}
        type="feather"
      />
      <Badge content="0" placement="topRight" variant="danger">
        <IconButton
          variant="vector"
          icon="notifications"
          color="white"
          size={10}
          type="ionicon"
        />
      </Badge>
    </HStack>
  </Header>
);

// Chat Item Component
const ChatItem = ({item}: {item: any}) => {
  const user = item.users?.[1];

  return (
    <Box g={3} py={4}>
      <HStack g={3} px={5}>
        <FastImage
          width={s(40)}
          height={s(40)}
          borderRadius="rounded-full"
          borderWidth={1}
          borderColor="primary"
          source={{uri: getImageUrl(user?.profilePicture)}}
        />
        <Box>
          <Text variant="b2medium">{user?.name || 'Unknown'}</Text>
          <Text variant="b3regular" numberOfLines={1}>
            Hey buddy, what's up
          </Text>
        </Box>
      </HStack>
      <Divider borderColor="neutral100" borderWidth={0.7} />
    </Box>
  );
};

// Feed Screen
export const FeedScreen = () => {
  useHeader(HomeHeader);

  const {data: chats = [], isLoading} = useGetChatsQuery();

  if (isLoading) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center">
        <ActivityIndicator />
      </Box>
    );
  }

  return (
    <Screen>
      <FlatList
        data={chats}
        keyExtractor={item => item._id.toString()}
        renderItem={({item}) => <ChatItem item={item} />}
      />
    </Screen>
  );
};

export default FeedScreen;
