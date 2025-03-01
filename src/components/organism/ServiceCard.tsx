import {getImageUrl} from '@/helper/image';
import theme from '@/theme';
import {useNavigation} from '@react-navigation/native';
import React, {FC, useEffect, useState} from 'react';
import {s} from 'react-native-size-matters';
import Clickable from '../ui/forms/Clickable';
import {Box} from '../ui/layout/Box';
import Card from '../ui/layout/Card';
import Divider from '../ui/layout/Divider';
import HStack from '../ui/layout/HStack';
import VStack from '../ui/layout/VStack';
import {FastImage} from '../ui/media-icons/FastImage';
import IconButton from '../ui/media-icons/IconButton';
import {Text} from '../ui/typography/Text';
import {useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import getDistance from 'geolib/es/getDistance';
import Icon from '../ui/media-icons/Icon';
import Geocoder from 'react-native-geocoding';
import {useLikeAServiceMutation} from '@/store/apiSlice';
import Center from '../ui/layout/Center';

Geocoder.init('e3193649-0706-47d9-93f6-459236b83ed4');

export const ServiceCard: FC<any> = ({service,refetch}) => {
  const {userId} = useSelector((state: RootState) => state.user);
  const userLocation = useSelector((state: RootState) => state.location);
  const serviceLocation = service?.location ? service?.location : userLocation;
  const [location, setLocation] = useState<string>('');
  const [likeAService, {isLoading}] = useLikeAServiceMutation();

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
        params: {id: service?.user?.id},
      });
    }
  };

  const heroImage = getImageUrl(service?.user?.profilePicture);

  const handleLikeService = async () => {
    try {
      const data = await likeAService({serviceId: service.id}).unwrap();
refetch();
    } catch (error) {
      console.log(error);
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
              style={{borderRadius: theme.borderRadii['rounded-full']}}
              width={s(25)}
              height={s(25)}
              source={{uri: heroImage}}
            />
          </Box>
          <HStack flex={1} justifyContent="space-between">
            <VStack>
              <Text variant="b2medium">{service?.user?.name}</Text>
              <Text variant="b5regular">Technician</Text>
            </VStack>
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
        </Clickable>
        <Divider borderWidth={0.5} />
        <Box
          width={50}
          height={50}
          position="absolute"
          zIndex={10}
          right={-20}
          top={-30}
          borderRadius="rounded-full"
          bg="primary"
        />
        <Clickable
          onPress={() =>
            navigation.navigate('ServiceDetails', {id: service?.id})
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
            <Icon icon="like1" color="primary" type="ant" size={6} variant="vector" />
            <Text ml={3}>{service?.likes ?? 0}</Text>
          </HStack>
        </HStack>
        <Divider borderWidth={0.5} />
        <HStack justifyContent="space-between" px={5} pt={5}>
          <IconButton
            icon="like2"
            variant="vector"
            type="ant"
            padding={0}
            onPress={() => handleLikeService()}
          />
          <IconButton
            icon="comment"
            variant="vector"
            size={9}
            type="evil"
            padding={0}
          />
          <IconButton icon="share" variant="vector" type="fa" padding={0} />
        </HStack>
      </Card>
    </>
  );
};

export default ServiceCard;
