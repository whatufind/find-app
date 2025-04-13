import {
  Box,
  Button,
  Card,
  ContentSafeAreaView,
  FastImage,
  Header,
  HStack,
  Icon,
  Input,
  Screen,
  Text,
  VStack,
} from '@/components';
import Carousel from '@/components/ui/data-display/Carousel';
import { getImageUrl } from '@/helper/image';
import useHeader from '@/hooks/useHeader';
import {
  useGetServiceByIdQuery,
  useGetServieReviewsQuery,
  useRequestAServiceMutation,
} from '@/store/apiSlice';
import { RootState } from '@/store/store';
import theme from '@/theme';
import { colors } from '@/theme/colors';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { s, vs } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import { toast } from 'sonner-native';

interface ServiceDetailsProps {
  route: {
    params: {
      id: string;
    };
  };
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ route }) => {
  const navigation = useNavigation();
  const { id } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [requestDetails, setRequestDetails] = useState(''); // State for capturing request details
  const { accessToken } = useSelector((state: RootState) => state.user);
  const { data: reviews } = useGetServieReviewsQuery({ serviceId: id });

  const [requestAService, { isLoading: isReqLoading }] =
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
  const { data, isLoading, refetch } = useGetServiceByIdQuery(id);

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" />
      </Box>
    );
  }

  const images = data?.media?.map(item => getImageUrl(item));

  const openBottomSheet = () => {
    sheetRef.current?.expand();
  };

  const handleSubmit = async () => {
    if (!accessToken) {
      navigation.navigate('Login');
    } else {
      const payload = {
        requestDetails,
        serviceId: id,
      };

      try {
        await requestAService({ data: payload }).unwrap();
        toast.success('Request submitted successfully');
        refetch();
        setModalVisible(!modalVisible);
        setRequestDetails('');
      } catch (err) {
        const errors = err?.message || err?.data?.message;
        console.log(errors);
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
              <Text mb={2}>Availability</Text>
              <Box
                flex={1}
                flexDirection="row"
                g={4}
                flexWrap="wrap"
                overflow="hidden">
                {data?.availability?.map((item, index) => (
                  <Box
                    px={2}
                    alignSelf="flex-start"
                    key={index}
                    bg="black"
                    borderRadius="rounded-full">
                    <Text color="white">
                      {moment(item?.day).format('MMMM Do YYYY')}
                    </Text>
                  </Box>
                ))}
              </Box>
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
                  style={{ borderRadius: theme.borderRadii['rounded-full'] }}
                  width={s(25)}
                  height={s(25)}
                  source={{ uri: data?.user?.profilePicture }}
                />
              </Box>
              <VStack>
                <Text variant="b2medium">{data?.user?.name}</Text>
                <Text variant="b5regular">Technician</Text>
                <Text variant="b5regular">{route?.params?.location}</Text>
              </VStack>
            </Box>
          </Card>
        </Box>
        <Text variant="heading2" my={5}>
          Reviews
        </Text>
        <FlashList
          data={reviews?.results}
          ListEmptyComponent={() => <Text>No reviews yet</Text>}
          ItemSeparatorComponent={() => <Box height={vs(10)} />}
          keyExtractor={item => item?.id}
          renderItem={({ item }) => (
            <Card variant="outlined" padding={5}>
              <Box py={2} flexDirection="row" g={3} alignItems="center">
                <Box
                  borderColor="primary"
                  borderWidth={2}
                  p={2}
                  borderRadius="rounded-full">
                  <FastImage
                    style={{ borderRadius: theme.borderRadii['rounded-full'] }}
                    width={s(25)}
                    height={s(25)}
                    source={{ uri: item?.user?.profilePicture }}
                  />
                </Box>
                <VStack>
                  <Text variant="b2medium">{item?.user?.name}</Text>
                  <HStack g={2}>
                    {Array(Math.ceil(item?.rating))
                      ?.fill(null)
                      .map((_, index) => (
                        <Icon
                          key={index}
                          icon="star"
                          color="warning"
                          size={6}
                          type="ant"
                          variant="vector"
                        />
                      ))}
                  </HStack>
                </VStack>
              </Box>
              <Text variant="b3regular">{item?.comment}</Text>
            </Card>
          )}
          estimatedItemSize={43.3}
        />

      </ContentSafeAreaView>
      <Box
        flexDirection="row"
        alignItems="center"
        px={5}
        py={5}
        justifyContent="center"
        g={5}>
        <Button
          onPress={() => openBottomSheet()}
          paddingHorizontal={4}
          flex={1}
          variant="primary">
          <Button.Text title="Get this service" />
        </Button>
      </Box>
      <BottomSheet
        index={-1}
        ref={sheetRef}
        handleIndicatorStyle={{ backgroundColor: colors.primary }}
        enablePanDownToClose
        snapPoints={['40%']}>
        <BottomSheetView style={{ flex: 1 }}>
          <BottomSheetScrollView>
            <ContentSafeAreaView flex={1} pb={5} g={3}>
              <Box>
                <Input
                  placeholder="Let the provider know what you need"
                  multiline
                  height={120}
                  size="hu"
                  textAlignVertical="top"
                  value={requestDetails}
                  onChangeText={setRequestDetails}
                />
              </Box>
              <Button
                loading={isReqLoading}
                onPress={handleSubmit}
                marginHorizontal={2}
                variant="primary">
                <Button.Text title="Send your request" />
              </Button>
            </ContentSafeAreaView>
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheet>
    </Screen>
  );
};
export default ServiceDetails;
