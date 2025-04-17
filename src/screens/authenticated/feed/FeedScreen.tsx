/* eslint-disable react/no-unstable-nested-components */
import React, {useCallback} from 'react';
import {FlatList, ActivityIndicator} from 'react-native';
import {
  Badge,
  Box,
  Center,
  Clickable,
  Divider,
  FastImage,
  Header,
  HStack,
  Icon,
  IconButton,
  Screen,
  Text,
  VStack,
} from '@/components';
import useHeader from '@/hooks/useHeader';
import {useGetChatsQuery} from '@/store/apiSlice';
import {getImageUrl} from '@/helper/image';
import {s} from 'react-native-size-matters';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '@/store/store';

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
      {/* <Badge content="0" placement="topRight" variant="danger">
        <IconButton
          variant="vector"
          icon="notifications"
          color="white"
          size={10}
          type="ionicon"
        />
      </Badge> */}
    </HStack>
  </Header>
);

// Chat Item Component
const ChatItem = ({item}: {item: any}) => {
  const {userId} = useSelector((state: RootState) => state.user);
  const target = item?.users.find(tUser => tUser.id !== userId);
  const navigation = useNavigation();

  return (
    <Box
      g={3}
      py={4}
      backgroundColor="white"
      elevation={1}
      shadowOpacity={0.05}>
      <Clickable
        onPress={() =>
          navigation.navigate('Chat', {user: target, chatId: item?._id})
        }>
        <HStack g={3} px={5}>
          <FastImage
            width={s(40)}
            height={s(40)}
            borderRadius="rounded-full"
            borderWidth={1}
            borderColor="primary"
            source={{uri: getImageUrl(target?.profilePicture)}}
          />
          <Box>
            <Text variant="b2medium">{target?.name || 'Unknown'}</Text>
            <Text variant="b3regular" numberOfLines={1}>
              {item?.latestMessage?.content}
            </Text>
          </Box>
        </HStack>
      </Clickable>
    </Box>
  );
};

// Feed Screen
export const FeedScreen = () => {
  useHeader(HomeHeader);

  const {data: chats = [], isLoading, refetch} = useGetChatsQuery();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  if (isLoading) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center">
        <ActivityIndicator />
      </Box>
    );
  }

  return (
    <Screen>
      <Box flex={1} mt={5}>
        <FlatList
          data={chats}
          ListEmptyComponent={() => (
            <Box alignItems="center" flex={1} justifyContent="center">
              <Center>
              <Icon
                size={26}
                icon="wechat"
                variant="vector"
                type="fa"
                color="neutral300"
              />
              <Text textAlign="center">You haven't any chat yet</Text>
              </Center>
            </Box>
          )}
          ItemSeparatorComponent={() => <Divider />}
          keyExtractor={item => item._id.toString()}
          renderItem={({item}) => <ChatItem item={item} />}
        />
      </Box>
    </Screen>
  );
};

export default FeedScreen;
