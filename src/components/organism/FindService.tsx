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

const FindService = () => {
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
            <Text variant="heading2" mb={2} textAlign="center" mt={5}>Seek a Service</Text>
            <Input placeholder="Tell use what you need" />
            <Input placeholder="Any brief about the service you seeking?" />
            <RNPickerSelect
                placeholder={{ label: 'Select a category', value: '' }}
                onValueChange={(value) => console.log(value)}
                items={[
                    { label: 'Engineering', value: 'Engineering' },
                    { label: 'Cleaning', value: 'Cleaning' },
                    { label: 'Designing', value: 'Designing' },
                ]}
            />
            <Input placeholder="Your Budget" keyboardType="numeric" />

            <Button mt={5} mb={5} paddingHorizontal={5} >
                <Button.Text title="Find Provider " />
            </Button>

        </ContentSafeAreaView>
    );
};

export default FindService;

const styles = StyleSheet.create({});
