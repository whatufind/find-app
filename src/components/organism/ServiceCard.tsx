import { IMAGE_URL } from '@/store/apiSlice';
import React, { FC } from 'react';
import Badge from '../ui/data-display/Badge';
import { Box } from '../ui/layout/Box';
import Card from '../ui/layout/Card';
import Divider from '../ui/layout/Divider';
import HStack from '../ui/layout/HStack';
import VStack from '../ui/layout/VStack';
import IconButton from '../ui/media-icons/IconButton';
import ImageBanner from '../ui/media-icons/ImageBanner';
import { Text } from '../ui/typography/Text';
import { useNavigation } from '@react-navigation/native';


export const ServiceCard: FC<any> = ({ service }) => {
    const navigation = useNavigation();
    return (
        <Card margin={1} variant="elevated" marginHorizontal={7} >
            {service?.media && <ImageBanner variant="remote" source={IMAGE_URL + '/' + service.media[0]?.substring(service.media[0]?.lastIndexOf('/') + 1)} />}
            <VStack mt={2} mb={2} px={3}  >
                <HStack flex={1} justifyContent="space-between" >
                    <Box flex={1}>
                        <Text variant="heading2" color="primary" numberOfLines={2} >{service.title}</Text>
                    </Box>
                    <Text numberOfLines={2} variant="b2bold" color="black" >${service.pricing}</Text>
                </HStack>
                <Text mb={3} numberOfLines={4}>{service.description}</Text>
                <Box position="relative">
                    <Badge variant="secondary" backgroundColor="black" content={service.category?.name} />
                </Box>
            </VStack>
            <Divider mt={8} />
            <VStack px={3}>
                <HStack justifyContent="space-between">
                    <Text variant="b4bold" color="success">{service?.serviceRequests?.length} Sold</Text>
                    <IconButton onPress={() => {
                        navigation.navigate('ServiceDetails', { id: service?._id });
                    }} icon="eye" variant="vector" type="ant" color="primary" />
                </HStack>
            </VStack>
        </Card>
    );
};

export default ServiceCard;


