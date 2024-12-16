import { serviceType } from '@/types/service';
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

type ServiceCardProps = {
    service: serviceType;
};

export const ServiceCard: FC<ServiceCardProps> = ({ service }) => {
    return (
        <Card margin={1} variant="elevated" marginHorizontal={7} >
            {service?.media && <ImageBanner variant="remote" source={service.media} />}
            <VStack mt={2} mb={2} px={3}  >
                <HStack flex={1} justifyContent="space-between" >
                    <Text variant="heading2" color="primary" >{service.name}</Text>
                    <Text numberOfLines={2} variant="b2bold" color="black"  >${service.price}</Text>
                </HStack>
                <Text mb={3}>{service.description}</Text>
                <Box position="relative">
                    <Badge content={service.category} />
                </Box>
            </VStack>
            <Divider mt={8} />
            <VStack px={3}>
                <HStack justifyContent="space-between">
                    <Text variant="b4bold" color="success">{service.orders} Sold</Text>
                    <IconButton icon="eye" variant="vector" type="ant" color="primary" />
                </HStack>
            </VStack>
        </Card>
    );
};

export default ServiceCard;


