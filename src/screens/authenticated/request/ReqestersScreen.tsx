/* eslint-disable react/no-unstable-nested-components */
import {
  Box,
  Card,
  Center,
  ContentSafeAreaView,
  Divider,
  FastImage,
  Header,
  HStack,
  IconButton,
  Screen,
  Text,
  VStack,
} from '@/components';
import useHeader from '@/hooks/useHeader';
import {
  useGetServiceRequestersQuery,
  useUpdateServiceRequestMutation,
} from '@/store/apiSlice';
import {RootState} from '@/store/store';
import theme from '@/theme';
import {FlashList} from '@shopify/flash-list';
import React from 'react';
import {s, vs} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {toast} from 'sonner-native';

export const RequestersScreen = ({route}: any) => {
  const {id} = route?.params || {};
  const {userId, userName} = useSelector((state: RootState) => state.user);
  const [updateServiceRequest] = useUpdateServiceRequestMutation();
  const {data,refetch, isLoading} = useGetServiceRequestersQuery({
    owner: userId,
    serviceId: id,
  });

  const AccountHeader = () => {
    return (
      <Header>
        <Header.BackAction />
        <Header.Content title="My Orders" />
        <Box flex={1} />
      </Header>
    );
  };

  useHeader(AccountHeader);

  const updateStatus = async (status: string, id: string) => {
    try {
      const res = await updateServiceRequest({
        status,
         id,
      }).unwrap();
      refetch();

    } catch (e) {
      toast.error( e?.data?.message || 'Failed to update the service requests');
    }
  };
  const renderItem = ({item}: {item: any}) => {
    return (
      <Card
        backgroundColor="white"
        variant="outlined"
        padding={5}
        width={theme.sizes.safeWidth}>
        <Box py={2} flexDirection="row" g={4} alignItems="center" my={2}>
          <Box
            borderColor="primary"
            borderWidth={2}
            p={2}
            borderRadius="rounded-full">
            <FastImage
              style={{borderRadius: theme.borderRadii['rounded-full']}}
              width={s(20)}
              height={s(20)}
              source={{uri: item?.requester?.profilePicture}}
            />
          </Box>
          <VStack>
            <Text variant="b2medium">{item?.requester?.name}</Text>
            <Text variant="b5regular">Technician</Text>
          </VStack>
        </Box>
      {item?.requestDetails ?  <Text>{item?.requestDetails}</Text> : null}
        <Divider borderWidth={0.5} my={4} />
        <HStack g={5} mt={3}>
          <Center>
            <IconButton
              onPress={() => updateStatus('pending', item?.id)}
              padding={0}
              icon="pending"
              variant="vector"
              type="material"
              color={item?.status === 'pending' ? 'secondary' : 'secondary200'}
            />
            <Text variant="b5regular">Pending</Text>
          </Center>
          <Center>
            <IconButton
              onPress={() => updateStatus('rejected', item?.id)}
              padding={0}
              icon="cancel"
              variant="vector"
              type="material"
              color={item?.status === 'rejected' ? 'danger' : 'secondary200'}
            />
            <Text variant="b5regular">Rejected</Text>
          </Center>
          <Center>
            <IconButton
              onPress={() => updateStatus('approved', item?.id)}
              padding={0}
              icon="check-circle"
              variant="vector"
              type="feather"
              color={item?.status === 'approved' ? 'success' : 'secondary200'}
            />
            <Text variant="b5regular">Approved</Text>
          </Center>
          <Center>
            <IconButton
              onPress={() => updateStatus('completed', item?.id)}
              padding={0}
              icon="clipboard-check"
              variant="vector"
              type="fa5"
              color={item?.status === 'completed' ? 'primary' : 'secondary200'}
            />
            <Text variant="b5regular">Completed</Text>
          </Center>
        </HStack>
      </Card>
    );
  };

  return (
    <Screen background="white">
      <ContentSafeAreaView flex={1} mt={5} g={5}>
        <FlashList
        extraData={[1]}
          data={data?.results || []}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Box height={vs(10)} />}
          estimatedItemSize={theme.sizes.safeWidth}
          keyExtractor={item => item?.id?.toString()}
          ListEmptyComponent={!isLoading && <Text>No requesters found.</Text>}
        />
      </ContentSafeAreaView>
    </Screen>
  );
};

export default RequestersScreen;
