import React, { useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, View } from 'react-native';
import {
    Badge,
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
} from '@/components';
import Carousel from '@/components/ui/data-display/Carousel';
import useHeader from '@/hooks/useHeader';
import { IMAGE_URL, useGetServiceByIdQuery } from '@/store/apiSlice';
import { s } from 'react-native-size-matters';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

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
    const { accessToken } = useSelector((state: RootState) => state.user);

    // Header component for the service details screen
    const HomeHeader = () => (
        <Header>
            <Header.BackAction />
            <Header.Content title="Service Details" />
            <Header.Action icon="notification" variant="svg" color="white" size={10} />
        </Header>
    );

    useHeader(HomeHeader);

    // Fetching service details using the provided ID
    const { data, isLoading } = useGetServiceByIdQuery(id);

    if (isLoading) {
        return (
            <Box flex={1} justifyContent="center" alignItems="center">
                <ActivityIndicator size="large" />
            </Box>
        );
    }

    const images = data?.media?.map((item) => `${IMAGE_URL}/${item.substring(item.lastIndexOf('/') + 1)}`);


    const handleSubmit = () => {
        if (!accessToken) {

            navigation.navigate('Login');
        } else {
            const payload = {
                requestDetails: 'I need this service on a specific date.',
            };

        }
    };

    return (
        <Screen safeAreaEdges={['top']} preset="scroll">
            <ContentSafeAreaView flex={1} justifyContent="space-between" my={5}>
                <Box>
                    <Box
                        position="absolute"
                        px={3}
                        zIndex={50}
                        right={10}
                        top={10}
                        bg="danger"
                        borderRadius="rounded-full"
                    >
                        <Text color="white">{data?.serviceRequests?.length} sold</Text>
                    </Box>
                    {images && <Carousel images={images} />}
                    <Card paddingVertical={5} paddingHorizontal={3} marginVertical={5} variant="elevated">
                        <HStack>
                            <Text>Pricing: </Text>
                            <Text fontWeight={800}>${data?.pricing}</Text>
                        </HStack>
                        <Text variant="heading2" color="black">
                            {data?.title}
                        </Text>
                        <Text mt={2} variant="b4medium" color="black">
                            {data?.description}
                        </Text>
                        <Box mt={3}>
                            {data?.category?.name && (
                                <Badge backgroundColor="success" content={data?.category?.name} />
                            )}
                        </Box>
                        <HStack mt={10} alignItems="center" g={3}>
                            <FastImage
                                source={{ uri: data?.user?.profilePicture }}
                                style={styles.profileImage}
                                width={s(15)}
                                height={s(15)}
                            />
                            <Text variant="heading3">{data?.user?.name}</Text>
                        </HStack>
                    </Card>
                    <Text>Availability</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        {data?.availability?.map((item, index) => (
                            <Box key={index} mr={3} px={3} bg="black" borderRadius="rounded-full" mt={3} mb={5}>
                                <Text color="white">{moment(item?.day).format('MMMM Do YYYY')}</Text>
                            </Box>
                        ))}
                    </ScrollView>
                </Box>
                <HStack justifyContent="center" g={5}>
                    <Button
                        onPress={() => setModalVisible(true)}
                        paddingHorizontal={4}
                        flex={1}
                        variant="primary"
                    >
                        <Button.Text title="Request Now!" />
                    </Button>
                    <Button paddingHorizontal={4} flex={1} variant="success">
                        <Button.Text title="Contact Provider!" />
                    </Button>
                </HStack>

            </ContentSafeAreaView>
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text variant="heading2" style={styles.modalTitle}>
                            Describe what you need?
                        </Text>
                        <Input multiline numberOfLines={10} style={styles.modalInput} />
                        <HStack justifyContent="space-between" mt={3}>
                            <Button onPress={() => setModalVisible(false)} flex={1} marginHorizontal={2}>
                                <Button.Text title="Cancel" />
                            </Button>
                            <Button flex={1} onPress={() => {
                                handleSubmit();
                            }}


                                marginHorizontal={2} variant="success">
                                <Button.Text title="Submit" />
                            </Button>
                        </HStack>
                    </View>
                </View>
            </Modal>
        </Screen>
    );
};

const styles = StyleSheet.create({
    profileImage: {
        borderRadius: 100,
        marginTop: 5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '100%',
        height: '50%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        textAlign: 'center',
        marginBottom: 15,
    },
    modalInput: {
        marginBottom: 15,
    },
});

export default ServiceDetails;
