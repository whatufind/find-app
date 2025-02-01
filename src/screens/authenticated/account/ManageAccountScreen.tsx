/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {
  Box,
  Button,
  Center,
  ContentSafeAreaView,
  FastImage,
  IconButton,
  Input,
  Screen,
  Text,
  VStack,
} from '@/components';
import {useGeUserQuery} from '@/store/apiSlice';
import {useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import {MultipleSelectList} from 'react-native-dropdown-select-list';
import {profession} from '@/data';

export const ManageAccountScreen = () => {
  const {userId} = useSelector((state: RootState) => state.user);
  const {data: user} = useGeUserQuery({userId});
  const [selected, setSelected] = React.useState([]);
  const [skills, setSkills] = React.useState([]);

  const ProfileSection = () => (
    <Box
      width="100%"
      bg="primary"
      paddingVertical={10}
      borderBottomLeftRadius="rounded-lg"
      borderBottomRightRadius="rounded-lg">
      <Center>
        <Box
          alignItems="center"
          width={50}
          height={50}
          borderRadius="rounded-full"
          justifyContent="center"
          backgroundColor="white">
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
            width={20}
            height={20}
            source={{uri: user?.profilePicture}}
          />
        </Box>
        <Text variant="heading3" color="white">
          {user?.name}
        </Text>
        <Text variant="heading3" color="white">
          {user?.professions?.[0]}
        </Text>
      </Center>
    </Box>
  );

  return (
    <Screen preset="auto">
      <ProfileSection />
      <ContentSafeAreaView g={4} mt={5}>
        <VStack>
          <Text>Your Name</Text>
          <Input placeholder="Your Name" textAlignVertical="top" />
        </VStack>
        <VStack>
          <Text>Your Primary Professions</Text>
          <Input
            placeholder="Your Bio"
            size="hu"
            height={200}
            multiline
            textAlignVertical="top"
          />
        </VStack>
        <VStack>
          <Text>Your Primary Profession</Text>
          <Input placeholder="Primary Profession" />
        </VStack>
        <VStack>
          <Text>Having more Professions?</Text>
          <MultipleSelectList
            setSelected={val => setSelected(val)}
            data={profession}
            save="value"
            onSelect={() => console.log('selected')}
            label="Professions"
          />
        </VStack>
        <VStack>
          <Text>Add Your Skills ( Max 10)?</Text>
          <MultipleSelectList
            setSelected={val => setSkills(val)}
            data={skills}
            save="value"
            onSelect={() => console.log('selected')}
            label="Professions"
          />
        </VStack>
        <Button>
          <Button.Text title="save" />
        </Button>
      </ContentSafeAreaView>
    </Screen>
  );
};

export default ManageAccountScreen;
