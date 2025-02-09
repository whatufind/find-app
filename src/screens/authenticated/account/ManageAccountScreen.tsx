import {
  Box,
  Button,
  Center,
  ContentSafeAreaView,
  FastImage,
  Header,
  IconButton,
  Input,
  Screen,
  Text,
  VStack,
} from '@/components';
import { getImageUrl } from '@/helper/image';
import useHeader from '@/hooks/useHeader';
import {
  useGetProfessionsQuery,
  useGetSkillsQuery,
  useGeUserQuery,
  useUpdateUserMutation,
} from '@/store/apiSlice';
import {RootState} from '@/store/store';
import {yupResolver} from '@hookform/resolvers/yup';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {MultipleSelectList} from 'react-native-dropdown-select-list';
import {useSelector} from 'react-redux';
import * as Yup from 'yup';

const editSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  phone: Yup.string()
    .required('Mobile Number is required')
    .matches(/^(01[3-9]\d{8})$/, 'Please enter a valid phone number'),
  about: Yup.string()
    .trim()
    .test('wordCount', 'About cannot be more than 100 words', value => {
      if (!value) {
        return true;
      }
      return value.split(/\s+/).filter(word => word).length <= 100;
    }),
  professions: Yup.array()
    .of(Yup.string())
    .max(3, 'You can select up to 3 professions'),
  skills: Yup.array().of(Yup.string().required('Skill is required')),
}).required();

export const ManageAccountScreen = () => {
  const AccountHeader = () => (
    <Header>
      <Header.BackAction />
      <Header.Content title="Manage Your Account" />
      <Box />
    </Header>
  );

  const {userId} = useSelector((state: RootState) => state.user);
  useHeader(AccountHeader);
  const {data: user} = useGeUserQuery({userId});
  const {data: skillsData} = useGetSkillsQuery({});
  const {data: professionData} = useGetProfessionsQuery({});
  const [updateUser, {isLoading}] = useUpdateUserMutation();

  const [professionIds, setProfessionIds] = useState([]);
  const [skillIds, setSkillIds] = useState([]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(editSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      about: user?.about || '',
      professions: user?.professions || [],
      skills: user?.skills || [],
    },
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('phone', user.phone || '');
      setValue('about', user.about || '');
      setValue('professions', user.professions || []);
      setValue('skills', user.skills || []);
    }
  }, [user, setValue]);

  const skills = skillsData?.results?.map(item => ({
    key: item?.id?.toString(),
    value: item?.name,
  }));

  const professions = professionData?.results?.map(item => ({
    key: item?.id?.toString(),
    value: item?.name,
  }));

  const onSubmit = async (formData: any) => {
    const updateData = new FormData();
    updateData.append('name', formData.name);
    updateData.append('phone', formData.phone);
    updateData.append('about', formData.about);
    formData.professions.forEach((prof: string) =>
      updateData.append('professions', prof),
    );
    formData.skills.forEach((skill: string) =>
      updateData.append('skills', skill),
    );

    try {
      console.log('Form Data:', formData);
      console.log('Update Data:', updateData);

      const res = await updateUser({ id: userId, userData: updateData }).unwrap();
      console.log(res, 'Response from API');
      console.log('User updated successfully');
    } catch (error) {
      console.log('Failed to update user', error);
    }
  };


  return (
    <Screen preset="auto">
      <Box
        width="100%"
        bg="primary"
        paddingVertical={10}
        borderBottomLeftRadius="rounded-lg"
        borderBottomRightRadius="rounded-lg">
        <Center>
          <Box
            alignItems="center"
            width={70}
            height={70}
           >
            <IconButton
              zIndex={10}
              iconStyle="contained"
              position="absolute"
              top={-10}
              right={-10}
              size={5}
              icon="edit"
              type="material"
              variant="vector"
              color="primary"
            />
            <FastImage
            borderWidth={2}
            borderColor="white"
            borderRadius="rounded-full"

              width={70}
              height={70}
              source={{uri: getImageUrl(user?.profilePicture)}}
            />
          </Box>
          <Text variant="heading3" color="white">
            {user?.name}
          </Text>
          <Text variant="heading3" color="white">
            {user?.professions?.[0]?.name}
          </Text>
        </Center>
      </Box>

      <ContentSafeAreaView g={4} mt={5}>
        <VStack>
          <Text>Your Name</Text>
          <Controller
            control={control}
            name="name"
            render={({field: {onChange, value}}) => (
              <Input
                placeholder="Your Name"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.name && <Text color="danger">{errors.name.message}</Text>}
        </VStack>

        <VStack>
          <Text>Your Bio</Text>
          <Controller
            control={control}
            name="about"
            render={({field: {onChange, value}}) => (
              <Input
                placeholder="Your Bio"
                height={100}
                multiline
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.about && <Text color="danger">{errors.about.message}</Text>}
        </VStack>

        <VStack>
          <Text>Your Contact Number</Text>
          <Controller
            control={control}
            name="phone"
            render={({field: {onChange, value}}) => (
              <Input
                placeholder="Your Contact Number"
                keyboardType="number-pad"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.phone && <Text color="danger">{errors.phone.message}</Text>}
        </VStack>

        <VStack>
          <Text>Your Professions</Text>
          <MultipleSelectList
            setSelected={val => setProfessionIds(val)}
            data={professions}
            save="value"
            onSelect={() => setValue('professions', professionIds)}
            label="Professions"
          />
          {errors.professions && (
            <Text color="danger">{errors.professions.message}</Text>
          )}
        </VStack>

        <VStack>
          <Text>Add Your Skills</Text>
          <MultipleSelectList
            setSelected={val => setSkillIds(val)}
            data={skills}
            save="value"
            onSelect={() => setValue('skills', skillIds)}
            label="Skills"
          />
          {errors.skills && <Text color="danger">{errors.skills.message}</Text>}
        </VStack>

        <Button onPress={handleSubmit(onSubmit)} disabled={isLoading}>
          <Button.Text title={isLoading ? 'Saving...' : 'Save'} />
        </Button>
      </ContentSafeAreaView>
    </Screen>
  );
};

export default ManageAccountScreen;
