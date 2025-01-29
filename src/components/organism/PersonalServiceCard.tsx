import {IMAGE_URL} from '@/store/apiSlice';
import theme from '@/theme';
import React, {FC} from 'react';
import {s} from 'react-native-size-matters';
import {Box} from '../ui/layout/Box';
import Card from '../ui/layout/Card';
import Divider from '../ui/layout/Divider';
import HStack from '../ui/layout/HStack';
import VStack from '../ui/layout/VStack';
import {FastImage} from '../ui/media-icons/FastImage';
import {Text} from '../ui/typography/Text';
import {useNavigation} from '@react-navigation/native';
import Clickable from '../ui/forms/Clickable';
import IconButton from '../ui/media-icons/IconButton';
import Center from '../ui/layout/Center';
import {Button} from '../ui/forms/Button';
import Icon from '../ui/media-icons/Icon';

export const PersonalServiceCard: FC<any> = ({service}) => {
  // navigation.navigate('ServiceDetails', { id: service?.id });
  const navigation = useNavigation();
  return (
    <Clickable
      onPress={() => navigation.navigate('ServiceDetails', {id: service?.id})}>
      <Card variant="outlined" paddingBottom={5}>
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
              uri:
                IMAGE_URL +
                '/' +
                service?.media[0]?.substring(
                  service.media[0]?.lastIndexOf('/') + 1,
                ),
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
          <Center>
            <IconButton icon="like2" variant="vector" type="ant" padding={0} />
            <Text>{service?.serviceRequests?.length} Likes</Text>
          </Center>
          <Center>
            <IconButton
              icon="comment"
              variant="vector"
              size={9}
              type="evil"
              padding={0}
            />
            <Text>{service?.reviews?.length} Reviews</Text>
          </Center>
          <Center>
            <Icon icon="clipboard-notes" variant="vector" type="foundation"/>
          <Text>{service?.serviceRequests?.length} Orders</Text>
          </Center>
          <Button  height={s(24)} px={3}
            onPress={() => navigation.navigate('Requesters', {id: service?.id})}
          >
            <Button.Text title="View Orders" />
          </Button>
        </HStack>
      </Card>
    </Clickable>
  );
};

export default PersonalServiceCard;
