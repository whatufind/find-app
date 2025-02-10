import {
  Box,
  Button,
  FastImage,
  Header,
  HStack,
  Icon,
  Input,
  Screen,
  Text,
  VStack,
} from '@/components';
import {socket} from '@/config/socketConfig';
import {getImageUrl} from '@/helper/image';
import useHeader from '@/hooks/useHeader';
import {RootState} from '@/store/store';
import React, {useEffect, useState} from 'react';
import {s} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import Messages from './Messages';
import {useSendMessageMutation} from '@/store/apiSlice';
import {ActivityIndicator} from 'react-native';
import theme from '@/theme';

export const ChatScreen = ({route}) => {
  // eslint-disable-next-line react/no-unstable-nested-components
  const ChatScreenHeader = () => {
    return (
      <Header>
        <Header.BackAction />
        <HStack flex={1} justifyContent="space-between">
          <Box flexDirection="row" alignItems="center" g={3}>
            <FastImage
              borderRadius="rounded-full"
              width={s(30)}
              height={s(30)}
              source={{uri: getImageUrl(targetUser?.profilePicture)}}
            />
            <VStack>
              <Text color="white">{targetUser?.name}</Text>
            </VStack>
          </Box>
          <Icon icon="dots-three-vertical" type="entypo" color="white" />
        </HStack>
      </Header>
    );
  };
  useHeader(ChatScreenHeader);
  const targetUser = route?.params?.user || {};
  const {chatId} = route?.params;
  const loggedInUser = useSelector((state: RootState) => state.user.userId);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const [sendMessage, {isLoading}] = useSendMessageMutation();

  useEffect(() => {
    // Listen for messages from the server
    socket.emit('setup', loggedInUser);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
  }, []);

  const handleSendMessage = async () => {
    if (chatId && newMessage.trim() !== '') {
      socket.emit('stop typing', chatId);

      const formData = new FormData();
      formData.append('chatId', chatId);
      formData.append('content', newMessage);

      // Append each file to the FormData object

      // Clear the message input after sending
      setNewMessage('');
      console.log('execute');
      try {
        const data = await sendMessage(formData).unwrap();
        console.log(data);
      } catch (error) {
        console.log('failed to send message');
      }
    }
  };

  const handleTyping = (e: any) => {
    setNewMessage(e);
    if (!socketConnected) {
      return;
    }

    if (!typing) {
      setTyping(true);
      socket.emit('typing', chatId);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', chatId);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <Screen>
      {isTyping && (
        <Box position="absolute" top={20} zIndex={10}>
          <ActivityIndicator />
        </Box>
      )}
      {chatId && <Messages chatId={chatId} />}
      <Box>
      <Input value={newMessage} onChangeText={e => handleTyping(e)} />
      </Box>
      <Button onPress={handleSendMessage}>
        <Button.Text title="send" />
      </Button>
    </Screen>
  );
};

export default ChatScreen;
