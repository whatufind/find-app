import { Box, FastImage, HStack, Text } from '@/components';
import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser,
} from '@/config/chatConfig';
import { getImageUrl } from '@/helper/image';
import { useGetAllMessagesFromAChatQuery } from '@/store/apiSlice';
import React, { FC, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { socket } from '../../../config/socketConfig';
import { RootState } from '../../../store/store';

type MessagesProps = {
  chatId: string;
};

const Messages: FC<MessagesProps> = ({chatId}) => {
    const {userId} = useSelector((state: RootState) => state.user);
  const {
    data: messages,
    refetch,
    error,
    isLoading,
  } = useGetAllMessagesFromAChatQuery(chatId || '');

  useEffect((): any => {
    socket.on('message recieved', newMessageRecieved => {
    refetch();
    });

    return () => socket.off('message recieved');
  }, [refetch]);

  useEffect(() => {
   if (messages) {
    socket.emit('join chat', chatId);
   }
  }, [chatId, messages]);


  console.log(messages);
  if (error) {
    return (
      <Box
        justifyContent="center"
        alignItems="center"
        height="100%">
        <Text variant="base" color="danger">
        Failed to load messages
        </Text>
      </Box>
    );
  }

  return (
    <ScrollView>
      {messages &&
        messages.map((m, i) => (
          <HStack  alignItems="flex-end" g={1} key={m._id}>
            {(isSameSender(messages, m, i, userId) ||
              isLastMessage(messages, i, userId)) && (
              <FastImage width={50} height={50} source={{uri:getImageUrl(m?.sender?.profilePicture)}}  />
            )}
            <Box
              overflow="hidden"
              bg="white"
              style={{
                marginLeft: isSameSenderMargin(messages, m, i, userId),
                marginTop: isSameUser(messages, m, i) ? 3 : 10,

                maxWidth: '75%',

              }}>
              {m?.media?.map(item => {
                return (
                  <img
                    style={{backgroundColor: 'red'}}
                    src={getImageUrl(item)}
                  />
                );
              })}
              <Text
              color={ m.sender.id === userId ? 'primary' : 'danger'}
                variant="base">
                {m.content}
              </Text>
            </Box>
          </HStack>
        ))}
    </ScrollView>
  );
};

export default Messages;
