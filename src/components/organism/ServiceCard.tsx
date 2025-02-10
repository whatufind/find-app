import {getImageUrl} from '@/helper/image';
import theme from '@/theme';
import {useNavigation} from '@react-navigation/native';
import React, {FC} from 'react';
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

export const ServiceCard: FC<any> = ({service}) => {
  const {userId} = useSelector((state: RootState) => state.user);
  // navigation.navigate('ServiceDetails', { id: service?.id });
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

  return (
    <Clickable
      onPress={() => navigation.navigate('ServiceDetails', {id: service?.id})}>
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
          <VStack>
            <Text variant="b2medium">{service?.user?.name}</Text>
            <Text variant="b5regular">Technician</Text>
          </VStack>
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
        <Divider borderWidth={0.5} />
        <HStack justifyContent="space-between" px={5} pt={5}>
          <IconButton icon="like2" variant="vector" type="ant" padding={0} />
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
    </Clickable>
  );
};

export default ServiceCard;
