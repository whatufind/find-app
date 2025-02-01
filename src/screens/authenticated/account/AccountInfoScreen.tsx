/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { Box, Center, FastImage, IconButton, Screen, Text } from '@/components';
import { useGeUserQuery } from '@/store/apiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export const AccountInfoScreen = () => {
    const { userId } = useSelector((state: RootState) => state.user);
  const { data:user } = useGeUserQuery({ userId });


const ProfileSection = () => (
  <Box
    width="100%"
    bg="primary"
    paddingVertical={10}
    borderBottomLeftRadius="rounded-lg"
    borderBottomRightRadius="rounded-lg"
  >
    <IconButton position="absolute" top={0} right={10} size={10} icon="edit" type="material" variant="vector"  color="white"/>
    <Center>
      <Box alignItems="center" width={50} height={50} borderRadius="rounded-full" justifyContent="center" backgroundColor="white">
        <FastImage width={20} height={20} source={{ uri: user?.profilePicture }} />
      </Box>
      <Text variant="heading3" color="white">{user?.name}</Text>
      <Text variant="heading3" color="white">{user?.professions?.[0]}</Text>

    </Center>
  </Box>
);


  return (
   <Screen >
    <ProfileSection />

   </Screen>
  );
};

export default AccountInfoScreen;

