import {
  Animation,
  Box,
  Clickable,
  ContentSafeAreaView,
  FastImage,
  Header,
  HStack,
  Icon,
  IconButton,
  Input,
  Screen,
  Text,
  VStack,
} from '@/components';
import {socket} from '@/config/socketConfig';
import {getImageUrl} from '@/helper/image';
import useHeader from '@/hooks/useHeader';
import {useSafeAreaInsetsStyle} from '@/hooks/useSafeAreaInsetsStyle';
import {useSendMessageMutation} from '@/store/apiSlice';
import {RootState} from '@/store/store';
import React, {useEffect, useState} from 'react';
import {s} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {toast} from 'sonner-native';
import Messages from './Messages';
import {launchImageLibrary} from 'react-native-image-picker';

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

    const [media, setMedia] = useState<
      {uri: string; type: string; name: string}[]
    >([]);


  const [sendMessage] = useSendMessageMutation();

  useEffect(() => {
    // Listen for messages from the server
    socket.emit('setup', loggedInUser);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
  }, []);

  const handleSendMessage = async () => {
    if (chatId && newMessage.trim() !== '' || media.length > 0) {
      socket.emit('stop typing', chatId);

      const formData = new FormData();
      formData.append('chatId', chatId);
      formData.append('content', newMessage);

      media.forEach((file) => {
        formData.append('media', file);
    });



      // Clear the message input after sending
      setNewMessage('');
      setMedia([]);
      try {
        const data = await sendMessage(formData).unwrap();
      } catch (error) {
        toast.error('Failed to send message');
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


    const handleChooseMedia = () => {
      const options = {
        mediaType: 'photo', // 'photo', 'video', or 'mixed'
        selectionLimit: 0, // 0 for unlimited selection
      };

      launchImageLibrary(options, response => {
        if (response.errorCode) {
          console.error('ImagePicker Error:', response.errorMessage);
        } else {
          const files = response.assets?.map(asset => ({
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName,
          }));

          if (files) {
            setMedia(prevMedia => [...prevMedia, ...files]);
          }
        }
      });
    };


  const safeAreaInset = useSafeAreaInsetsStyle(['bottom']);
  return (
    <Screen>
      <ContentSafeAreaView flex={1}>
        {chatId && <Messages chatId={chatId} />}
        {isTyping && <Animation animation={'loader'} />}
      </ContentSafeAreaView>
      <Box
        g={4}
        px={5}
        bg="white"
        flexDirection="row"
        pt={5}
        mb={5}
        alignItems="center">
        <Input
          placeholder="Type message"
          size="sm"
          value={newMessage}
          onChangeText={e => handleTyping(e)}
        />
        <Clickable onPress={handleChooseMedia}>
          <Icon icon="image" color="primary" />
        </Clickable>
        <IconButton
          color="primary"
          onPress={handleSendMessage}
          iconStyle="contained"
          icon="send"
          variant="vector"
          type="feather"
        />
      </Box>
      <Box style={safeAreaInset} bg="white" />
    </Screen>
  );
};

export default ChatScreen;
