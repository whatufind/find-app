import { IMAGE_URL } from '@/store/apiSlice';
import theme from '@/theme';
import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import Badge from '../ui/data-display/Badge';
import { Box } from '../ui/layout/Box';
import Card from '../ui/layout/Card';
import Divider from '../ui/layout/Divider';
import HStack from '../ui/layout/HStack';
import VStack from '../ui/layout/VStack';
import { FastImage } from '../ui/media-icons/FastImage';
import IconButton from '../ui/media-icons/IconButton';
import { Text } from '../ui/typography/Text';


export const ServiceCard: FC<any> = ({ service }) => {
    const navigation = useNavigation();
    return (
        <Card margin={1} variant="elevated" marginHorizontal={7} >
            {service?.media?.[0] &&
                <FastImage resizeMode="cover" source={{ uri: IMAGE_URL + '/' + service?.media[0]?.substring(service.media[0]?.lastIndexOf('/') + 1) }} width={theme.sizes.safeWidth} height={theme.sizes.safeWidth} />

            }
            <VStack mt={2} mb={2} px={3}  >
                <HStack flex={1} justifyContent="space-between" >
                    <Box flex={1}>
                        <Text variant="heading3" color="black" numberOfLines={2} >{service.title}</Text>
                    </Box>
                    {service?.type !== 'find' &&
                        <Text numberOfLines={2} variant="b2bold" color="black300" >${service.pricing}</Text>
                    }
                </HStack>
                <Text mb={3} color="black400" numberOfLines={4}>{service.description}</Text>
                <Box position="relative">
                    <Badge variant="secondary" backgroundColor="black" content={service.category?.name} />
                </Box>
            </VStack>
            <Divider mt={8} />
            <VStack px={3}>
                <HStack justifyContent="space-between">
                    {service?.type !== 'find' &&
                        <Text variant="b4bold" color="success">{service?.serviceRequests?.length} Sold</Text>

                    }
                    <IconButton onPress={() => {
                        navigation.navigate('ServiceDetails', { id: service?.id });
                    }} icon="eye" variant="vector" type="ant" color="primary" />
                </HStack>
            </VStack>
        </Card>
    );
};

export default ServiceCard;


