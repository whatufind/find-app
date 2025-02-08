/* eslint-disable react/no-unstable-nested-components */
import {
  Box,
  Center,
  ContentSafeAreaView,
  FastImage,
  Header,
  Input,
  Screen,
  Text,
  VStack,
} from '@/components';
import { getImageUrl } from '@/helper/image';
import useHeader from '@/hooks/useHeader';
import { useGeUserQuery } from '@/store/apiSlice';
import { RootState } from '@/store/store';
import React from 'react';
import { useSelector } from 'react-redux';

export const AccountInfoScreen = () => {
  const AccountHeader = () => {
    return (
      <Header>
        <Header.BackAction />
        <Header.Content title="Account Detials" />
        <Box />
      </Header>
    );
  };
  const {userId} = useSelector((state: RootState) => state.user);
  const {data: user} = useGeUserQuery({userId});

  useHeader(AccountHeader);


  console.log(user,'user information');
  const ProfileSection = () => (
    <Center>
      <Box
        alignItems="center"
        width={50}
        height={50}
        borderRadius="rounded-full"
        justifyContent="center"
        backgroundColor="primary">
        <FastImage
          width={20}
          height={20}
          source={{uri: getImageUrl(user?.profilePicture)}}
        />
      </Box>
      <Text variant="heading3" color="white">
        {user?.name}
      </Text>
      <Text variant="heading3" color="white">
        {user?.professions?.[0]?.name?.name}
      </Text>
    </Center>
  );
  return (
    <Screen>
      <ProfileSection />
      <ContentSafeAreaView g={5}>
        <VStack g={3}>
          <Text>Your Name</Text>
          <Input />
        </VStack>
        <VStack g={3}>
          <Text>Your Email</Text>
          <Input />
        </VStack>
        <VStack g={3}>
          <Text>Your Phone</Text>
          <Input />
        </VStack>
        <VStack g={3}>
          <Text>Your Name</Text>
          <Input />
        </VStack>
        <VStack g={3}>
          <Text>Your Name</Text>
          <Input />
        </VStack>
      </ContentSafeAreaView>
    </Screen>
  );
};

export default AccountInfoScreen;
