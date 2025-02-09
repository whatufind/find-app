import {
  Box,
  Button,
  ContentSafeAreaView,
  Divider,
  FastImage,
  Header,
  HStack,
  Icon,
  IconButton,
  Screen,
  Text,
  VStack,
} from '@/components';
import {getImageUrl} from '@/helper/image';
import useHeader from '@/hooks/useHeader';
import {useGeUserQuery} from '@/store/apiSlice';
import {RootState} from '@/store/store';
import theme from '@/theme';
import React from 'react';
import {ScrollView} from 'react-native';
import {s, vs} from 'react-native-size-matters';
import {useSelector} from 'react-redux';

const PublicProfileScreenHeader = () => {
  return <Box />;
};

export const PublicProfileScreen = () => {
  const {userId} = useSelector((state: RootState) => state.user);
  const {data: user} = useGeUserQuery({userId});

  const tabs = ['About', 'Top services', 'Reviews'];

  useHeader(PublicProfileScreenHeader);
  return (
    <Screen>
      <Box height={theme.sizes.safeWidth / 1.5}>
        <Box height={theme.sizes.safeWidth / 1.5}>
          <FastImage
            source={{uri: getImageUrl(user?.coverPhoto)}}
            width={theme.sizes.width}
            height={theme.sizes.safeWidth / 2}
          />
          <ContentSafeAreaView position="absolute" bottom={0}>
            <HStack g={5} alignItems="center">
              <FastImage
                borderRadius="rounded-full"
                borderWidth={3}
                borderColor="white"
                width={s(70)}
                height={s(70)}
                source={{uri: getImageUrl(user?.profilePicture)}}
              />
              <HStack justifyContent="space-between" flex={1} mt={5}>
                <VStack>
                  <Text variant="b1bold">{user?.name}</Text>
                  <Text variant="b3semiBold">
                    {user?.professions?.[0]?.name}
                  </Text>
                </VStack>
                <HStack>
                  <Button size="sm" height={s(20)} px={5}>
                    <Button.Text title="Follow" />
                  </Button>
                  <IconButton
                    icon="chatbubble-ellipses-outline"
                    type="ionicon"
                    variant="vector"
                  />
                  <IconButton icon="phone" type="ant" variant="vector" />
                </HStack>
              </HStack>
            </HStack>
          </ContentSafeAreaView>
        </Box>
      </Box>
      <ContentSafeAreaView>
        {user?.about ? (
          <Text textAlign="center" variant="b5regular" mt={4}>
            {user?.about}
          </Text>
        ) : null}
      </ContentSafeAreaView>
      <Divider borderColor="neutral100" />
      <ContentSafeAreaView flex={1}>
        <ScrollView style={{flexGrow: 0}}>
          <HStack g={5} mt={3}>
            {tabs?.map(tab => (
              <Button
                variant="black"
                size="sm"
                height={vs(17)}
                px={5}
                key={tab}>
                <Button.Text title={tab} />
              </Button>
            ))}
          </HStack>
        </ScrollView>
        <Box
          g={3}
          backgroundColor="white"
          borderRadius="rounded-sm"
          mt={5}
          p={5}>
          <HStack g={3}>
            <Text color="black" variant="b3bold">
              Nationality:
            </Text>
            <Text>Bangladeshi</Text>
          </HStack>
          <HStack g={3}>
            <Text color="black" variant="b3bold">
              Location:
            </Text>
            <Text>Dhaka Bangladesh</Text>
          </HStack>
          <HStack g={3}>
            <Text color="black" variant="b3bold">
              Contact Number:
            </Text>
            <Text>{user?.phone}</Text>
          </HStack>
          <HStack g={3}>
            <Text color="black" variant="b3bold">
              Primary Profession:
            </Text>
            <Text>{user?.professions?.[0]?.name}</Text>
          </HStack>
          <VStack>
            <Text color="black" variant="b3bold">
              Other Professions:
            </Text>
            <HStack flexWrap="nowrap" g={3}>
              {user?.professions?.slice(1)?.map(profession => (
                <Button px={3} key={profession?.id} size="sm" height={vs(15)}>
                  <Button.Text title={profession?.name} />
                </Button>
              ))}
            </HStack>
          </VStack>
          <VStack>
            <Text color="black" variant="b3bold">
            Skills:
            </Text>
            <HStack flexWrap="nowrap" g={3}>
              {user?.skills?.map(skill => (
                <Button variant="black" px={3} key={skill?.id} size="sm" height={vs(15)}>
                  <Button.Text title={skill?.name} />
                </Button>
              ))}
            </HStack>
          </VStack>
        </Box>
      </ContentSafeAreaView>
    </Screen>
  );
};

export default PublicProfileScreen;
