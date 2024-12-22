import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Input } from '../ui/forms/Input';
import ContentSafeAreaView from '../ui/layout/ContentSafeAreaView';
import { Text } from '../ui/typography/Text';
import DateTimePicker from '@react-native-community/datetimepicker';
import IconButton from '../ui/media-icons/IconButton';
import { Box } from '../ui/layout/Box';
import { Button } from '../ui/forms/Button';

const CreateService = () => {
    const [dateTimes, setDateTimes] = useState<Date[]>([]); // Store multiple dates/times
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

    const onChange = (event, selectedDate) => {
        if (selectedDate) {
            if (pickerMode === 'date') {
                // Update date and then show time picker
                setCurrentDate((prevDate) => new Date(selectedDate.setHours(prevDate.getHours(), prevDate.getMinutes())));
                setPickerMode('time');
                setShowPicker(true); // Show time picker next
            } else {
                // Add the full date-time to the list
                setDateTimes((prevDateTimes) => [...prevDateTimes, selectedDate]);
                setShowPicker(false);
            }
        } else {
            setShowPicker(false);
        }
    };

    const showDatePicker = () => {
        setPickerMode('date');
        setShowPicker(true);
    };

    return (
        <ContentSafeAreaView gap={5}>
            <Text variant="heading2" mb={2} mt={5} textAlign="center">Create Service</Text>
            <Input placeholder="Service Title" />
            <Input placeholder="Service Description" />
            <RNPickerSelect
                placeholder={{ label: 'Select a category', value: '' }}
                onValueChange={(value) => console.log(value)}
                items={[
                    { label: 'Engineering', value: 'Engineering' },
                    { label: 'Cleaning', value: 'Cleaning' },
                    { label: 'Designing', value: 'Designing' },
                ]}
            />
            <Input placeholder="Price of the service" keyboardType="numeric" />
            <Box flexDirection="row" alignItems="center" mt={2}>
                <Text flex={1}>Choose Availability:</Text>
                <IconButton
                    onPress={showDatePicker}
                    type="ant"
                    icon="calendar"
                    color="primary"
                    variant="vector"
                />
            </Box>

            {dateTimes.map((dateTime, index) => (
                <Box key={index} borderColor="primary" borderBottomWidth={2} alignSelf="flex-start" >
                    <Text mt={2}>
                        {dateTime.toLocaleString()}
                    </Text>
                </Box>
            ))}

            {showPicker && (
                <DateTimePicker
                    value={currentDate}
                    mode={pickerMode}
                    is24Hour={false}
                    onChange={onChange}
                />
            )}
            <Button alignSelf="flex-start" paddingHorizontal={5} type="outlined">
                <Button.Icon variant="vector" color="primary" type="feather" icon="image" />
                <Button.Text title="Choose media" />
            </Button>

            <Button mt={5} mb={5} paddingHorizontal={5} >
                <Button.Text title="Create" />
            </Button>

        </ContentSafeAreaView>
    );
};

export default CreateService;

const styles = StyleSheet.create({});
