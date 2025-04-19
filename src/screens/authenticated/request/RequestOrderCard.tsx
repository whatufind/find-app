import {
  Box,
  Card,
  Center,
  Divider,
  FastImage,
  HStack,
  Icon,
  IconButton,
  Text,
} from '@/components';
import {getImageUrl} from '@/helper/image';
import {
  useCreateChatMutation,
  useUpdateServiceRequestMutation,
} from '@/store/apiSlice';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {FC} from 'react';

type RequestOrderCardProps = {
  request: any;
  onPress: () => void;
};

const RequestOrderCard: FC<RequestOrderCardProps> = ({request, onPress}) => {
  const [createChat, {isLoading}] = useCreateChatMutation();
  const navigation = useNavigation();
  const handleCreateChat = async () => {
    try {
      const data = await createChat({userId: request?.owner?.id}).unwrap();
      navigation.navigate('Chat', {
        user: request?.requester?.id,
        chatId: data?._id,
      });
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <Card variant="outlined" paddingHorizontal={3} paddingVertical={4}>
      <Box
        position="absolute"
        right={0}
        bg={
          request?.status === 'pending'
            ? 'secondary'
            : request?.status === 'rejected'
            ? 'danger'
            : request?.status === 'approved'
            ? 'success'
            : request?.status === 'completed'
            ? 'primary'
            : 'primary'
        }
        borderBottomLeftRadius="rounded-xs"
        paddingHorizontal={3}>
        <Text color="white" variant="b5regular">
          {request?.status}
        </Text>
      </Box>
      <HStack justifyContent="space-between" py={3} my={3}>
        <HStack g={4}>
          <FastImage
            width={30}
            height={30}
            borderRadius="rounded-full"
            source={{uri: getImageUrl(request?.owner?.profilePicture)}}
          />
          <Box>
            <Text>{request?.owner?.name}</Text>
            <Text variant="b5regular">
              {moment(request?.createdAt).format('MM Do YY, h:mm a')}
            </Text>
          </Box>
        </HStack>
        <HStack>
          <IconButton
          onPress={()=>handleCreateChat()}
            icon="chatbubble-ellipses-outline"
            type="ionicon"
            variant="vector"
          />
        </HStack>
      </HStack>
      {request?.requestDetails ? (
        <Text variant="b3regular">{request?.requestDetails}</Text>
      ) : null}
    </Card>
  );
};

export default RequestOrderCard;
