import { getImageUrl } from '@/helper/image';
import {
  useCreateChatMutation,
  useGeUserQuery,
  useLikeAServiceMutation,
} from '@/store/apiSlice';
import { RootState } from '@/store/store';
import theme from '@/theme';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import getDistance from 'geolib/es/getDistance';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';
import Geocoder from 'react-native-geocoding';
import Share from 'react-native-share';
import { s } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import { toast } from 'sonner-native';
import Clickable from '../ui/forms/Clickable';
import { Box } from '../ui/layout/Box';
import Card from '../ui/layout/Card';
import Divider from '../ui/layout/Divider';
import HStack from '../ui/layout/HStack';
import VStack from '../ui/layout/VStack';
import { FastImage } from '../ui/media-icons/FastImage';
import Icon from '../ui/media-icons/Icon';
import IconButton from '../ui/media-icons/IconButton';
import { Text } from '../ui/typography/Text';

Geocoder.init('AIzaSyBYjtw327hGVGtIEEGiRKUBwgZBQC8zejk');

export const ServiceCard: FC<any> = ({ service, refetch }) => {
  const { userId } = useSelector((state: RootState) => state.user);
  const userLocation = useSelector((state: RootState) => state.location);
  const serviceLocation = service?.location ? service?.location : userLocation;
  const [location, setLocation] = useState<string>('');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [likeAService, { isLoading }] = useLikeAServiceMutation();
  const [snapIndex, setSnapIndex] = useState<number>(-1);
  const [createChat, { isLoading: isChatLoading }] = useCreateChatMutation();

  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(service?.likes ?? 0);

  const { data: userData, error: userError } = useGeUserQuery({
    userId: service?.user?.id,
  });

  const openBottomSheet = () => {
    // Open bottom sheet
    setSnapIndex(0);
  };

  const closeBottomSheet = () => {
    // Close bottom sheet
    setSnapIndex(-1);
  };

  const distance = getDistance(
    {
      latitude: userLocation.latitude || 0,
      longitude: userLocation.longitude || 0,
    },
    {
      latitude: serviceLocation.latitude || 0,
      longitude: serviceLocation.longitude || 0,
    },
  );

  const navigation = useNavigation();

  const navigateToPublicProfile = () => {
    if (userId === service?.user?.id) {
      navigation.navigate('Root', {
        screen: 'AccountStack',
      });
    } else {
      navigation.navigate('AuthenticatedStack', {
        screen: 'Public Profile',
        params: { id: service?.user?.id },
      });
    }
  };

  const heroImage = getImageUrl(service?.user?.profilePicture);

  const handleLikeService = async () => {
    try {
      setIsLikedState(!isLikedState); // Toggle the local state
      setLikesCount(prev => (isLikedState ? prev - 1 : prev + 1)); // Adjust count optimistically

      await likeAService({ serviceId: service.id }).unwrap();
      refetch(); // Ensure actual data is refetched
    } catch (error) {
      // Rollback on failure
      setIsLikedState(isLiked);
      setLikesCount(service?.likes ?? 0);
    }
  };

  const handleShare = async () => {
    const shareOptions = {
      message: service?.title,
      url: heroImage,
    };

    try {
      const shareResponse = await Share.open(shareOptions);
      console.log('Share Response:', JSON.stringify(shareResponse));
    } catch (error) {
      console.log('Share Error:', error);
    }
  };

  const handleRedirectToChat = async () => {
    try {
      const data = await createChat({ userId: service.user.id }).unwrap();
      navigation.navigate('Chat', { user: service?.user?.id, chatId: data?._id });
    } catch (error) {
      toast.error('Failed to create chat message');
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const result = await Geocoder.from(
          userLocation.latitude,
          userLocation.longitude,
        );
        const address = result.results[0].formatted_address;
        setLocation(address);
      } catch (error) {
        // console.error('Error fetching location:', error);
        setLocation('Error fetching location');
      }
    };

    fetchLocation();
  }, [userLocation]);

  const isLiked = service?.likedBy?.findIndex(liker => liker === userId) !== -1;

  console.log(isLiked);

  return (
    <>
      <Card variant="outlined" paddingBottom={5}>
        <Clickable
          onPress={() => navigateToPublicProfile()}
          py={2}
          px={5}
          flexDirection="row"
          g={4}
          alignItems="center"
          my={2}>
          <Box
            borderColor="primary"
            borderWidth={2}
            p={2}
            borderRadius="rounded-full">
            <FastImage
              style={{ borderRadius: theme.borderRadii['rounded-full'] }}
              width={s(25)}
              height={s(25)}
              source={{ uri: heroImage }}
            />
          </Box>
          <HStack flex={1} justifyContent="space-between">
            <VStack>
              <HStack g={3}>
                <Text variant="b2medium">{service?.user?.name}</Text>
                {service?.averageRating > 0 && (
                  <>
                    <Icon
                      icon="star"
                      color="warning200"
                      size={6}
                      type="ant"
                      variant="vector"
                    />
                    <Text color="black" textAlign="center">
                      {service?.averageRating}
                    </Text>
                  </>
                )}
              </HStack>
              <HStack>
                <Text>{userData?.professions?.[0]?.name}</Text>
                {distance ? (
                  <HStack>
                    <Icon icon="location" type="evil" variant="vector" />
                    <Text>
                      {(distance * 0.000621)?.toFixed(2)}
                      Miles
                    </Text>
                  </HStack>
                ) : null}
              </HStack>
            </VStack>
          </HStack>
        </Clickable>
        <Divider borderWidth={0.5} />
        <Clickable
          onPress={() =>
            navigation.navigate('ServiceDetails', {
              id: service?.id,
              location: location,
            })
          }>
          {service?.media?.[0] && (
            <FastImage
              resizeMode="cover"
              source={{
                uri: getImageUrl(service?.media[0]),
              }}
              width={theme.sizes.safeWidth}
              height={theme.sizes.safeWidth}
            />
          )}

          <VStack px={5} py={2}>
            <HStack flex={1} justifyContent="space-between">
              <Box flex={1}>
                <Text variant="b1medium" color="black" numberOfLines={2}>
                  {service.title}
                </Text>
              </Box>
            </HStack>
            <Text mb={3} color="black400" numberOfLines={10}>
              {service.description}
            </Text>
          </VStack>
        </Clickable>
        <HStack justifyContent="space-between" px={5} pt={5}>
          <HStack alignItems="center" justifyContent="center" mt={2}>
            <Icon icon="heart" size={6} color="danger" />
            <Icon
              icon="like1"
              color="primary"
              type="ant"
              size={6}
              variant="vector"
            />
            <Text ml={3}>{likesCount}</Text>
          </HStack>
        </HStack>
        <Divider borderWidth={0.5} />
        <HStack justifyContent="space-between" px={5} pt={5}>
          <IconButton
            icon={isLikedState ? 'like1' : 'like2'}
            variant="vector"
            type="ant"
            color={isLikedState ? 'primary' : 'black'}
            padding={0}
            onPress={handleLikeService}
          />
          <IconButton
            icon="telephone"
            variant="vector"
            size={9}
            type="foundation"
            onPress={openBottomSheet}
            padding={0}
          />
          <IconButton
            onPress={handleShare}
            icon="send"
            variant="vector"
            type="feather"
            padding={0}
          />
        </HStack>
      </Card>

      <BottomSheet
        enablePanDownToClose
        ref={bottomSheetRef}
        index={snapIndex}
        snapPoints={['25%', '50%', '90%']} // Adjust snap points
        onClose={closeBottomSheet}>
        <BottomSheetView>
          <HStack alignItems="center" justifyContent="space-between" mx={5}>
            <IconButton
              onPress={() => handleRedirectToChat()}
              type="ant"
              variant="vector"
              icon="message1"
              color="primary"
            />
            <IconButton
              type="feather"
              variant="vector"
              icon="phone"
              onPress={() => Linking.openURL(`tel:${service?.user?.phone}`)}
              color="black"
            />
            <IconButton
              onPress={() => Linking.openURL('whatsapp://app')}
              type="fa"
              variant="vector"
              icon="whatsapp"
              color="success"
            />
          </HStack>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

export default ServiceCard;
