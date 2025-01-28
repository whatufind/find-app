import {
  Box,
  Button,
  Card,
  ContentSafeAreaView,
  FastImage,
  Header,
  HStack,
  Input,
  Screen,
  Text,
  VStack,
} from '@/components';
import Carousel from '@/components/ui/data-display/Carousel';
import useHeader from '@/hooks/useHeader';
import {
  IMAGE_URL,
  useGetServiceByIdQuery,
  useRequestAServiceMutation,
} from '@/store/apiSlice';
import {RootState} from '@/store/store';
import theme from '@/theme';
import {colors} from '@/theme/colors';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useRef, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {s} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {toast} from 'sonner-native';

interface ServiceDetailsProps {
  route: {
    params: {
      id: string;
    };
  };
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({route}) => {
  const navigation = useNavigation();
  const {id} = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [requestDetails, setRequestDetails] = useState(''); // State for capturing request details
  const {accessToken} = useSelector((state: RootState) => state.user);
  const [requestAService, {isLoading: isReqLoading}] =
    useRequestAServiceMutation();
  const sheetRef = useRef<BottomSheet>(null);

  // Header component for the service details screen
  const HomeHeader = () => (
    <Header>
      <Header.BackAction />
      <Header.Content title="Service Details" />
      <Header.Action
        icon="notification"
        variant="svg"
        color="white"
        size={10}
      />
    </Header>
  );

  useHeader(HomeHeader);

  // Fetching service details using the provided ID
  const {data, isLoading, refetch} = useGetServiceByIdQuery(id);

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" />
      </Box>
    );
  }

  const images = data?.media?.map(
    item => `${IMAGE_URL}/${item.substring(item.lastIndexOf('/') + 1)}`,
  );

  const openBottomSheet = () => {
    console.log('execute');
    sheetRef.current?.expand();
  };

  // Validate the request details input
  const validateRequestDetails = (details: string) => {
    if (!details.trim()) {
      toast.error('Please provide a description for your request.');
      return false;
    }
    if (details.length < 10) {
      toast.error('Request details should be at least 10 characters long.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!accessToken) {
      navigation.navigate('Login');
    } else {
      if (!validateRequestDetails(requestDetails)) {
        return;
      }

      const payload = {
        requestDetails,
        serviceId: id,
      };

      try {
        const response = await requestAService({id, data: payload}).unwrap();
        toast.success('Request submitted successfully');
        refetch();
        setModalVisible(!modalVisible);
        setRequestDetails(''); // Clear input after submission
      } catch (err) {
        const errors = err?.message || err?.data?.message;
        toast.error(errors);
      }
    }
  };

  return (
    <Screen safeAreaEdges={['top']} preset="auto">
      <ContentSafeAreaView
        flex={1}
        justifyContent="space-between"
        paddingBottom={5}>
        <Box g={5}>
          {images && <Carousel images={images} />}
          <Card paddingVertical={5} paddingHorizontal={3} variant="elevated">

            <Text variant="b2medium" color="black">
              {data?.title}
            </Text>
            <Text mt={2} variant="b4medium" color="black">
              {data?.description}
            </Text>
          </Card>

          <Card padding={5} gap={5}>
            <VStack>
              <Text>Availability</Text>
              {data?.availability?.map((item, index) => (
                <Box
                  key={index}
                  mr={3}
                  px={3}
                  bg="black"
                  borderRadius="rounded-full"
                  mt={3}
                  mb={5}>
                  <Text color="white">
                    {moment(item?.day).format('MMMM Do YYYY')}
                  </Text>
                </Box>
              ))}
              {data?.availability?.length === 0 && (
                <Box
                  bg="success"
                  alignSelf="flex-start"
                  px={2}
                  py={1}
                  borderRadius="rounded-sm">
                  <Text color="white">Always Open</Text>
                </Box>
              )}
            </VStack>

            {data?.pricing && (
              <HStack>
                <Text>Pricing: </Text>
                <Text fontWeight={800}>${data?.pricing}</Text>
              </HStack>
            )}
            {data?.category && (
              <HStack>
                <Text>Category: </Text>
                <Text fontWeight={800}>{data?.category?.name}</Text>
              </HStack>
            )}
          </Card>
          <Card padding={5}>
            <Text mb={2} variant="heading3">
              User Profile
            </Text>
            <Box py={2} flexDirection="row" g={3} alignItems="center">
              <Box
                borderColor="primary"
                borderWidth={2}
                p={2}
                borderRadius="rounded-full">
                <FastImage
                  style={{borderRadius: theme.borderRadii['rounded-full']}}
                  width={s(25)}
                  height={s(25)}
                  source={{uri: data?.user?.profilePicture}}
                />
              </Box>
              <VStack>
                <Text variant="b2medium">{data?.user?.name}</Text>
                <Text variant="b5regular">Technician</Text>
              </VStack>
            </Box>
          </Card>
        </Box>
      </ContentSafeAreaView>

      <Box
        flexDirection="row"
        alignItems="center"
        px={5}
        bg="white"
        py={5}
        justifyContent="center"
        g={5}>
        {data?.type !== 'find' && (
          <Button
            onPress={() => openBottomSheet()}
            paddingHorizontal={4}
            flex={1}
            variant="primary">
            <Button.Text title="Order Now" />
          </Button>
        )}
        <Button paddingHorizontal={4} flex={1} variant="success">
          <Button.Text title="Contact" />
        </Button>
      </Box>
      <BottomSheet
        index={-1}
        ref={sheetRef}
        handleIndicatorStyle={{backgroundColor: colors.primary}}
        enablePanDownToClose
        snapPoints={['40%']}>
        <BottomSheetView style={{flex: 1}}>
          <ContentSafeAreaView flex={1} justifyContent="space-between" pb={5} g={3}>
            <Text variant="heading2">Describe what you need?</Text>
            <Input
              placeholder="Your Service Description"
              height={100}
              multiline
              textAlignVertical="top"
              value={requestDetails}
              onChangeText={setRequestDetails}
            />
            <Button
              loading={isReqLoading}
              onPress={handleSubmit}
              marginHorizontal={2}
              variant="success">
              <Button.Text title="Submit" />
            </Button>
          </ContentSafeAreaView>
        </BottomSheetView>
      </BottomSheet>
    </Screen>
  );
};
export default ServiceDetails;
