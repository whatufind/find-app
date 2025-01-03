import { useCreateServiceMutation, useGetServiceCategoriesQuery } from '@/store/apiSlice';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { toast } from 'sonner-native';
import { Button } from '../ui/forms/Button';
import { Input } from '../ui/forms/Input';
import ContentSafeAreaView from '../ui/layout/ContentSafeAreaView';
import { Text } from '../ui/typography/Text';

const FindService = () => {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
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

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('type', 'find');
        try {
            await createService(formData).unwrap();
            toast.success('Your request submitted');
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
                Find a Service Provider
            </Text>
            <Input placeholder="What u Need?" value={title} onChangeText={setTitle} />
            <Input placeholder="Your requirements" value={description} onChangeText={setDescription} />
            <RNPickerSelect
                placeholder={{ label: 'What type of service you need?', value: '' }}
                onValueChange={setCategory}
                items={categories}
            />
            <Button mt={5} mb={5} paddingHorizontal={5} onPress={handleSubmit} disabled={isLoading}>
                <Button.Text title={isLoading ? 'Finding...' : 'Find'} />
            </Button>
        </ContentSafeAreaView>
    );
};

export default FindService;
