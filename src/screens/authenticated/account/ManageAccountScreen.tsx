/* eslint-disable react/no-unstable-nested-components */
import {
  Box,
  Button,
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
import { RootState } from '@/store/store';
import theme from '@/theme';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image } from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import { toast } from 'sonner-native';
import * as Yup from 'yup';

const editSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  phone: Yup.string()
    .required('Mobile Number is required')
    .matches(/^(01[3-9]\d{8})$/, 'Please enter a valid phone number'),
  profilePicture: Yup.mixed(),
  coverPhoto: Yup.mixed(),
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
  const {data: user, refetch} = useGeUserQuery({userId});
  const {data: skillsData} = useGetSkillsQuery({});
  const {data: professionData} = useGetProfessionsQuery({});
  const [updateUser, {isLoading}] = useUpdateUserMutation();
  const [profilePicture, setprofilePicture] = useState('');
  const [cover, setCover] = useState('');

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
      professions: Array.isArray(user?.professions)
        ? user.professions.map(item => item.id)
        : [],
      skills: Array.isArray(user?.skills)
        ? user.skills.map(item => item.id)
        : [],
    },
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('phone', user.phone || '');
      setValue('about', user.about || '');
      setValue(
        'professions',
        Array.isArray(user?.professions)
          ? user.professions.map(item => item.id)
          : [],
      );
      setValue(
        'skills',
        Array.isArray(user?.skills) ? user.skills.map(item => item.id) : [],
      );
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
    if (profilePicture) {
      updateData.append('profilePicture', profilePicture);
    }
    if (cover) {
      updateData.append('coverPhoto', cover);
    }
    formData.skills.forEach((skill: string) =>
      updateData.append('skills', skill),
    );

    try {
      const res = await updateUser({id: userId, userData: updateData}).unwrap();
      toast.success('Information updated successfully', {duration: 2000});
      refetch();
    } catch (error) {
      console.log(error);
      toast.error('Failed to update');
    }
  };

  const options = {
    mediaType: 'photo',
  };
  const handleChooseProfilePicture = () => {
    launchImageLibrary(options, response => {
      if (response.errorCode) {
        return;
      } else {
        const files = response.assets?.map(asset => ({
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName,
        }));
        setprofilePicture(files?.[0]);
      }
    });
  };
  const handleChooseCover = () => {
    launchImageLibrary(options, response => {
      if (response.errorCode) {
        return;
      } else {
        const files = response.assets?.map(asset => ({
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName,
        }));
        setCover(files?.[0]);
      }
    });
  };

  return (
    <Screen preset="auto">
      <Box
        width="100%"
        bg="primary"
        overflow="hidden"
        paddingVertical={10}
        borderBottomLeftRadius="rounded-lg"
        borderBottomRightRadius="rounded-lg">
        <Image
        source={{uri: cover?.uri ?? getImageUrl(user?.coverPhoto)}}
          style={{
            width: theme.sizes.width,
            height: theme.sizes.width / 1.8,
            position: 'absolute',
          }}
          defaultSource={{
            uri: 'https://bclung.ca/wp-content/themes/bclung/assets/images/video-cover-placeholder.jpg',
          }}
        />
        <IconButton
          zIndex={10}
          iconStyle="contained"
          position="absolute"
          size={8}
          right={5}
          onPress={handleChooseCover}
          icon="edit"
          type="material"
          variant="vector"
          backgroundColor="white"
          color="primary"
        />
          <Box alignItems="center" >
            <FastImage
              borderWidth={2}
              borderColor="white"
              borderRadius="rounded-full"
              width={100}
              height={100}
              source={{uri: profilePicture?.uri ?? getImageUrl(user?.profilePicture)}}
            />
            <IconButton
              zIndex={10}
              iconStyle="contained"
              position="absolute"
              bottom={-10}
              right={-30}
              backgroundColor="white"
              size={5}
              icon="edit"
              onPress={handleChooseProfilePicture}
              type="material"
              variant="vector"
              color="primary"
            />
          </Box>
          <Text mt={5} variant="heading3" color="white" textAlign="center">
            {user?.name}
          </Text>
          <Text variant="heading3" color="white" textAlign="center">
            {user?.professions?.[0]?.name}
          </Text>
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
                multiline
                size="hu"
                numberOfLines={4}
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
            setSelected={val => {
              setProfessionIds(val);
            }}
            data={professions}
            save="key"
            onSelect={() => setValue('professions', professionIds)}
            label="Professions"
          />
          {errors.professions && (
            <Text color="danger">{errors.professions.message}</Text>
          )}
        </VStack>

        <VStack>
          <Text>Your Skills</Text>
          <MultipleSelectList
            setSelected={val => setSkillIds(val)}
            data={skills}
            save="key"
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
