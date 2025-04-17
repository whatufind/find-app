import {
  Box,
  Card,
  Center,
  Divider,
  FastImage,
  HStack,
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
import {Linking} from 'react-native';

type RequestCardProps = {
  request: any;
  onPress: () => void;
};

const RequestCard: FC<RequestCardProps> = ({request, onPress}) => {
  const [createChat, {isLoading}] = useCreateChatMutation();
  const [updateServiceRequest] = useUpdateServiceRequestMutation();
  const navigation = useNavigation();
  const updateStatus = async (status: string, id: string) => {
    try {
      const res = await updateServiceRequest({
        status,
        id,
      }).unwrap();
      // refetch();
      onPress();
    } catch (e) {
      toast.error(e?.data?.message || 'Failed to update the service requests');
    }
  };

  const handleCreateChat = async () => {
    try {
      const data = await createChat({userId: request?.requester?.id}).unwrap();
      navigation.navigate('Chat', {
        user: request?.owner?.id,
        chatId: data?._id,
      });
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <Card variant="outlined" paddingHorizontal={3} paddingVertical={4}>
      <HStack g={5} my={3}>
        <Center>
          <IconButton
            onPress={() => updateStatus('pending', request?.id)}
            padding={0}
            icon="tasks"
            variant="vector"
            type="fa5"
            color={request?.status === 'pending' ? 'secondary' : 'secondary200'}
          />
          <Text variant="b5regular">Pending</Text>
        </Center>
        <Center>
          <IconButton
            onPress={() => updateStatus('rejected', request?.id)}
            padding={0}
            icon="cancel"
            variant="vector"
            type="material"
            color={request?.status === 'rejected' ? 'danger' : 'secondary200'}
          />
          <Text variant="b5regular">Rejected</Text>
        </Center>
        <Center>
          <IconButton
            onPress={() => updateStatus('approved', request?.id)}
            padding={0}
            icon="check-circle"
            variant="vector"
            type="feather"
            color={request?.status === 'approved' ? 'success' : 'secondary200'}
          />
          <Text variant="b5regular">Approved</Text>
        </Center>
        <Center>
          <IconButton
            onPress={() => updateStatus('completed', request?.id)}
            padding={0}
            icon="clipboard-check"
            variant="vector"
            type="fa5"
            color={request?.status === 'completed' ? 'primary' : 'secondary200'}
          />
          <Text variant="b5regular">Completed</Text>
        </Center>
        <Center>
          <IconButton
            onPress={() => navigation.navigate('ServiceDetails', request?.serviceId)}
            padding={0}
            icon="eye"
            variant="vector"
            type="fa"
            color="primary"
          />
          <Text variant="b5regular">View Service</Text>
        </Center>
      </HStack>
      <Divider borderWidth={0.5} />
      <HStack justifyContent="space-between" py={3} my={3}>
        <HStack g={4}>
          <FastImage
            width={30}
            height={30}
            borderRadius="rounded-full"
            source={{uri: getImageUrl(request?.requester?.profilePicture)}}
          />
          <Box>
            <Text>{request?.requester?.name}</Text>
            <Text variant="b5regular">
              {moment(request?.createdAt).format('MM Do YY, h:mm a')}
            </Text>
          </Box>
        </HStack>
        <HStack>
          <IconButton
            onPress={() => handleCreateChat()}
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

export default RequestCard;
