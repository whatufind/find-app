/* eslint-disable no-catch-shadow */
import {
  useCreateServiceMutation,
  useGetServiceCategoriesQuery,
  useGetServicesQuery,
} from '@/store/apiSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import FastImage from 'react-native-fast-image';
import {launchImageLibrary} from 'react-native-image-picker';
import {toast} from 'sonner-native';
import {Button} from '../ui/forms/Button';
import Checkbox, {CheckboxStatus} from '../ui/forms/CheckBox';
import {Input} from '../ui/forms/Input';
import {Box} from '../ui/layout/Box';
import ContentSafeAreaView from '../ui/layout/ContentSafeAreaView';
import HStack from '../ui/layout/HStack';
import VStack from '../ui/layout/VStack';
import IconButton from '../ui/media-icons/IconButton';
import {Text} from '../ui/typography/Text';
import {detectDevice} from '@/utils';
import {useSelector} from 'react-redux';
import {RootState} from '@/store/store';

const CreateService = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [media, setMedia] = useState<
    {uri: string; type: string; name: string}[]
  >([]);
  const [availabilityEntries, setAvailabilityEntries] = useState<
    {day: string; timeRange: string}[]
  >([]);
  const [currentDay, setCurrentDay] = useState(new Date());
  const [currentTimeRange, setCurrentTimeRange] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [createService, {isLoading}] = useCreateServiceMutation();
  const [categories, setCategories] = useState([]);
  const {data, error} = useGetServiceCategoriesQuery({});
  const [checked, setChecked] = useState(false);
  const location = useSelector((state: RootState) => state.location);
  const {refetch} = useGetServicesQuery({});

  useEffect(() => {
    if (data) {
      const formattedCategories = data?.results?.map?.((cat: any) => ({
        key: cat?.id,
        value: cat?.name,
      }));
      setCategories(formattedCategories);
    }
  }, [data]);

  const addAvailabilityEntry = () => {
    if (currentDay && currentTimeRange) {
      setAvailabilityEntries(prevEntries => [
        ...prevEntries,
        {
          day: moment(currentDay).format('YYYY-MM-DD'), // Ensure date format is consistent
          timeRange: currentTimeRange,
        },
      ]);
      setCurrentDay(new Date()); // Reset to the current date to avoid reusing the previous date
      setCurrentTimeRange(''); // Clear the time range input
    }
  };

  const removeAvailabilityEntry = (index: number) => {
    setAvailabilityEntries(prevEntries =>
      prevEntries.filter((_, i) => i !== index),
    );
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setCurrentDay(selectedDate); // Set the selected date properly
    }
    setShowDatePicker(false); // Close the picker
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

    launchImageLibrary(options, response => {
      if (response.didCancel) {
      } else if (response.errorCode) {
      } else {
        const files = response.assets?.map(asset => ({
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName,
        }));

        if (files) {
          setMedia(prevMedia => [...prevMedia, ...files]);
        }
      }
    });
  };

  const handleSubmit = async () => {
    if (!title) {
      toast.warning('Title is required');
      return;
    }
    if (!description) {
      toast.warning('Description is required');
      return;
    }
    if (!category) {
      toast.warning('Category is required');
      return;
    }
    if (!price) {
      toast.warning('Price is required');
      return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('pricing', price);
    formData.append('type', 'create');
    formData.append('location[latitude]',location.latitude );
    formData.append('location[longitude]',location.longitude );

    if (checked) {
      setAvailabilityEntries([]);
    }

    // Append availability
    availabilityEntries.forEach((entry, index) => {
      formData.append(`availability[${index}][day]`, entry.day);
      formData.append(`availability[${index}][timeRange]`, entry.timeRange);
    });

    // Append media files
    media.forEach(file => {
      formData.append('media', file);
    });

    try {
      await createService(formData).unwrap();
      toast.success('Service created successfully');
      refetch();
    } catch (error: any) {
      if (error?.data?.code === 401) {
        navigation.navigate('Login');
        return;
      }
      console.log(error?.data?.message);
      toast.error(error?.data?.message || "Couldn't create service");
    }
  };

  return (
    <ContentSafeAreaView gap={5} mt={4}>
      <Input
        placeholder="Your Service Title"
        value={title}
        onChangeText={setTitle}
      />
      <Input
        placeholder="Your Service Description"
        size="hu"
        height={100}
        multiline
        textAlignVertical="top"
        value={description}
        onChangeText={setDescription}
      />
      <Box borderWidth={1} borderColor="secondary100" borderRadius="rounded-sm">
        <SelectList setSelected={val => setCategory(val)} data={categories} />
      </Box>
      <Input
        placeholder="৳ Price of your service"
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
      />

      <VStack g={3}>
        <Text>Select Your availability</Text>
        <Box flexDirection="row" flex={1} alignItems="center" g={4} mt={2}>
          <Button flex={1} onPress={() => setShowDatePicker(true)}>
            <Button.Text
              title={`${currentDay.toLocaleDateString() || 'select date'}`}
            />
          </Button>
          <Button flex={1} onPress={() => setShowTimePicker(true)}>
            <Button.Text title={` ${currentTimeRange || 'Select time'}`} />
          </Button>
          <IconButton
            iconStyle="contained"
            onPress={addAvailabilityEntry}
            type="ant"
            icon="plus"
            color="primary"
            variant="vector"
          />
        </Box>
      </VStack>
      {showDatePicker && (
        <DateTimePicker
          value={currentDay}
          mode="date"
          display={detectDevice?.isIOS ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display={detectDevice?.isIOS ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}

      {availabilityEntries.map((entry, index) => (
        <Box
          borderBottomWidth={1}
          borderBottomColor="black50"
          key={index}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          mt={2}>
          <Text>{`${moment(entry?.day).format('MMMM Do YYYY, h:mm:ss a')} - ${
            entry.timeRange
          }`}</Text>
          <IconButton
            onPress={() => removeAvailabilityEntry(index)}
            type="ant"
            icon="delete"
            color="danger"
            variant="vector"
          />
        </Box>
      ))}
      <HStack flex={1}>
        <Checkbox
          status={checked ? CheckboxStatus.Checked : CheckboxStatus.Unchecked}
          onPress={() => {
            setChecked(!checked);
          }}
        />
        <Box>
          <Text>Always Open</Text>
        </Box>
      </HStack>
      <Button paddingHorizontal={5} type="outlined" onPress={handleChooseMedia}>
        <Button.Icon
          variant="vector"
          color="primary"
          type="feather"
          icon="image"
        />
        <Button.Text title="Choose media" />
      </Button>

      {/* Display media */}
      <Box flexDirection="row" flexWrap="wrap" gap={4} mt={4}>
        {media.map((file, index) => (
          <Box key={index}>
            <IconButton
              onPress={() =>
                setMedia(prevMedia => prevMedia.filter((_, i) => i !== index))
              }
              type="ant"
              icon="closecircle"
              color="danger"
              variant="vector"
            />
            <FastImage
              source={{uri: file.uri}}
              style={styles.mediaPreview}
              resizeMode={FastImage.resizeMode.cover}
            />
          </Box>
        ))}
      </Box>
      <Button
        mb={5}
        paddingHorizontal={5}
        onPress={handleSubmit}
        disabled={isLoading}>
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
