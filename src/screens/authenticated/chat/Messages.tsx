import {Box, FastImage, HStack, Text} from '@/components';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from '@/config/chatConfig';
import {getImageUrl} from '@/helper/image';
import {useGetAllMessagesFromAChatQuery} from '@/store/apiSlice';
import React, {FC, useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';
import {socket} from '../../../config/socketConfig';
import {RootState} from '../../../store/store';
import {ActivityIndicator} from 'react-native';

type MessagesProps = {
  chatId: string;
};

const Messages: FC<MessagesProps> = ({chatId}) => {
  const {userId} = useSelector((state: RootState) => state.user);
  const {
    data: messages = [],
    refetch,
    error,
    isLoading,
  } = useGetAllMessagesFromAChatQuery(chatId || '');

  const listRef = useRef<FlashList<any>>(null);

  useEffect(() => {
    socket.on('message recieved', () => refetch());
    return () => {
      socket.off('message recieved');
    };
  }, [refetch]);

  useEffect(() => {
    if (messages.length) {
      socket.emit('join chat', chatId);
    }
  }, [chatId, messages]);

  if (error) {
    return (
      <Box justifyContent="center" alignItems="center" height="100%">
        <Text variant="base" color="danger">
          Failed to load messages
        </Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box justifyContent="center" alignItems="center" height="100%" flex={1}>
        <ActivityIndicator />
      </Box>
    );
  }

  const renderItem = ({item: m, index}: {item: any; index: number}) => (
    <HStack alignItems="flex-end" g={4} key={m._id}>
      {(isSameSender(messages, m, index, userId) ||
        isLastMessage(messages, index, userId)) && (
        <FastImage
          width={30}
          height={30}
          borderWidth={1}
          borderColor="primary300"
          borderRadius="rounded-full"
          source={{uri: getImageUrl(m?.sender?.profilePicture)}}
        />
      )}
      <Box
        overflow="hidden"
        mt={isSameUser(messages, m, index) ? 5 : 7}
        style={{
          marginLeft: isSameSenderMargin(messages, m, index, userId),
          maxWidth: '75%',
        }}>
        <Box
          borderRadius="rounded-sm"
          p={2}
          bg={m.sender.id === userId ? 'white' : 'primary'}>
          <Text
            color={m.sender.id === userId ? 'black' : 'white'}
            variant="base">
            {m.content}
          </Text>
        </Box>
      </Box>
    </HStack>
  );

  const SomeMilliSecondsTimeout = async () => {
    await new Promise((res, rej) => {
      setTimeout(res, 10);
    });
  };

  return (
    <FlashList
      ref={listRef}
      onContentSizeChange={async () => {
        await SomeMilliSecondsTimeout();
        listRef.current?.scrollToEnd({animated: true});
      }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={messages}
      extraData={messages.length}
      renderItem={renderItem}
      estimatedItemSize={50}
      keyExtractor={item => item._id}
    />
  );
};

export default Messages;
