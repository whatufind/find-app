import { IMAGE_URL } from '@/store/apiSlice';
import theme from '@/theme';
import React, { FC } from 'react';
import { s } from 'react-native-size-matters';
import { Box } from '../ui/layout/Box';
import Card from '../ui/layout/Card';
import Divider from '../ui/layout/Divider';
import HStack from '../ui/layout/HStack';
import VStack from '../ui/layout/VStack';
import { FastImage } from '../ui/media-icons/FastImage';
import { Text } from '../ui/typography/Text';
import { useNavigation } from '@react-navigation/native';
import Clickable from '../ui/forms/Clickable';

export const ServiceCard: FC<any> = ({service}) => {
  // navigation.navigate('ServiceDetails', { id: service?.id });
  const navigation = useNavigation();
  return (
   <Clickable onPress={()=>navigation.navigate('ServiceDetails', { id: service?.id })}>
     <Card variant="outlined" paddingBottom={5}>
        <Box width={50} height={50} position="absolute" zIndex={10} right={-20} top={-30} borderRadius="rounded-full" bg="primary"/>
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
      <Box py={2} px={5} flexDirection="row" g={4} alignItems="center">
      <Box  borderColor="primary" borderWidth={2} p={2}  borderRadius="rounded-full">
      <FastImage style={{borderRadius:theme.borderRadii['rounded-full']}} width={s(25)} height={s(25)} source={{uri:service?.user?.profilePicture}}/>
      </Box>
        <VStack>
        <Text variant="b2medium">{service?.user?.name}</Text>
        <Text variant="b5regular">Technician</Text>
        </VStack>
      </Box>
      <Divider borderWidth={0.5}/>
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
    </Card>
   </Clickable>
  );
};

export default ServiceCard;
