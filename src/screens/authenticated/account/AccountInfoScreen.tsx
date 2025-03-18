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


  const ProfileSection = () => (
    <Center>

        <FastImage
        borderRadius="rounded-full"
        borderColor="primary"
        borderWidth={2}
          width={100}
          height={100}
          source={{uri: getImageUrl(user?.profilePicture)}}
        />
    </Center>
  );
  return (
    <Screen>
      <ProfileSection />
      <ContentSafeAreaView g={5} mt={5}>
        <VStack g={3}>
          <Text>Your Name</Text>
          <Input editable={false} value={user?.name} />
        </VStack>
        <VStack g={3}>
          <Text>Your Email</Text>
          <Input editable={false} value={user?.email} />
        </VStack>
        <VStack g={3}>
          <Text>Your Phone</Text>
          <Input editable={false}  value={user?.phone} />
        </VStack>
        <VStack g={3}>
          <Text>Your Primary Profession</Text>
          <Input editable={false} value={user?.professions?.[0]?.name} />
        </VStack>
      </ContentSafeAreaView>
    </Screen>
  );
};

export default AccountInfoScreen;
