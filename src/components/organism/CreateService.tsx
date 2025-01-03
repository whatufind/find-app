import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import FastImage from 'react-native-fast-image';
import { launchImageLibrary } from 'react-native-image-picker';
import { Input } from '../ui/forms/Input';
import ContentSafeAreaView from '../ui/layout/ContentSafeAreaView';
import { Text } from '../ui/typography/Text';
import IconButton from '../ui/media-icons/IconButton';
import { Box } from '../ui/layout/Box';
import { Button } from '../ui/forms/Button';
import { useCreateServiceMutation, useGetServiceCategoriesQuery } from '@/store/apiSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import { toast } from 'sonner-native';
import { useNavigation } from '@react-navigation/native';

const CreateService = () => {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [media, setMedia] = useState<{ uri: string; type: string; name: string }[]>([]);
    const [availabilityEntries, setAvailabilityEntries] = useState<{ day: string; timeRange: string }[]>([]);
    const [currentDay, setCurrentDay] = useState(new Date());
    const [currentTimeRange, setCurrentTimeRange] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [createService, { isLoading }] = useCreateServiceMutation();
    const [categories, setCategories] = useState([]);
    const { data } = useGetServiceCategoriesQuery({});

    useEffect(() => {
        if (data) {
            const formattedCategories = data?.results?.map?.((cat: any) => ({
                label: cat?.name,
                value: cat?.id,
            }));
            setCategories(formattedCategories);
        }
    }, [data]);

    const addAvailabilityEntry = () => {
        if (currentDay && currentTimeRange) {
            setAvailabilityEntries((prevEntries) => [
                ...prevEntries,
                { day: currentDay.toISOString(), timeRange: currentTimeRange },
            ]);
            setCurrentDay(new Date());
            setCurrentTimeRange('');
        }
    };

    const removeAvailabilityEntry = (index: number) => {
        setAvailabilityEntries((prevEntries) => prevEntries.filter((_, i) => i !== index));
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || currentDay;
        setShowDatePicker(false);
        setCurrentDay(currentDate);
    };

    const handleTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || new Date();
        setShowTimePicker(false);
        setCurrentTimeRange(currentTime.toLocaleTimeString());
    };

    const handleChooseMedia = () => {
        const options = {
            mediaType: 'photo', // 'photo', 'video', or 'mixed'
            selectionLimit: 0, // 0 for unlimited selection
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.error('ImagePicker Error:', response.errorMessage);
            } else {
                const files = response.assets?.map((asset) => ({
                    uri: asset.uri,
                    type: asset.type,
                    name: asset.fileName,
                }));

                if (files) {
                    setMedia((prevMedia) => [...prevMedia, ...files]);
                }
            }
        });
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('pricing', price);
        formData.append('tyoe', 'create');

        // Append availability
        availabilityEntries.forEach((entry, index) => {
            formData.append(`availability[${index}][day]`, entry.day);
            formData.append(`availability[${index}][timeRange]`, entry.timeRange);
        });

        // Append media files
        media.forEach((file) => {
            formData.append('media', file);
        });

        try {
            await createService(formData).unwrap();
            toast.success('Service created successfully');
        } catch (error) {
            if (error?.data?.code === 401) {
                navigation.navigate('Login');
                return;
            }
            toast.error(error?.data?.message || "Couldn't create service");
        }
    };

    return (
        <ContentSafeAreaView gap={5}>
            <Text variant="heading2" mb={2} mt={5} textAlign="center">
                Create Service
            </Text>
            <Input placeholder="Service Title" value={title} onChangeText={setTitle} />
            <Input placeholder="Service Description" value={description} onChangeText={setDescription} />
            <RNPickerSelect
                placeholder={{ label: 'Select a category', value: '' }}
                onValueChange={setCategory}
                items={categories}
            />
            <Input placeholder="Price of the service" value={price} keyboardType="numeric" onChangeText={setPrice} />

            <Box flexDirection="row" flex={1} alignItems="center" g={4} mt={2}>
                <Button flex={1} onPress={() => setShowDatePicker(true)}>
                    <Button.Text title={`${currentDay.toLocaleDateString() || 'select date'}`} />
                </Button>
                <Button flex={1} onPress={() => setShowTimePicker(true)}>
                    <Button.Text title={` ${currentTimeRange || 'Select time'}`} />
                </Button>
                <IconButton
                    onPress={addAvailabilityEntry}
                    type="ant"
                    icon="plus"
                    color="primary"
                    variant="vector"
                />
            </Box>

            {showDatePicker && (
                <DateTimePicker value={currentDay} mode="date" display="default" onChange={handleDateChange} />
            )}

            {showTimePicker && (
                <DateTimePicker value={new Date()} mode="time" display="default" onChange={handleTimeChange} />
            )}

            {availabilityEntries.map((entry, index) => (
                <Box key={index} flexDirection="row" alignItems="center" mt={2}>
                    <Text>{`${entry.day} - ${entry.timeRange}`}</Text>
                    <IconButton
                        onPress={() => removeAvailabilityEntry(index)}
                        type="ant"
                        icon="delete"
                        color="primary"
                        variant="vector"
                    />
                </Box>
            ))}

            <Button alignSelf="flex-start" paddingHorizontal={5} type="outlined" onPress={handleChooseMedia}>
                <Button.Icon variant="vector" color="primary" type="feather" icon="image" />
                <Button.Text title="Choose media" />
            </Button>

            {/* Display media */}
            <Box flexDirection="row" flexWrap="wrap" gap={4} mt={4}>
                {media.map((file, index) => (
                    <Box key={index}  >
                        <IconButton
                            onPress={() => setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index))}
                            type="ant"
                            icon="closecircle"
                            color="danger"
                            variant="vector"
                        />
                        <FastImage
                            source={{ uri: file.uri }}
                            style={styles.mediaPreview}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </Box>
                ))}
            </Box>

            <Button mt={5} mb={5} paddingHorizontal={5} onPress={handleSubmit} disabled={isLoading}>
                <Button.Text title={isLoading ? 'Creating...' : 'Create'} />
            </Button>
        </ContentSafeAreaView>
    );
};

export default CreateService;

const styles = StyleSheet.create({
    mediaPreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    deleteIcon: {
        position: 'absolute',
        top: -10,
        right: -10,
    },
});
