/* eslint-disable react/no-unstable-nested-components */
import {
  Box,
  Button,
  Clickable,
  ContentSafeAreaView,
  Divider,
  FastImage,
  HStack,
  IconButton,
  Input,
  Radio,
  Screen,
  ServiceCard,
  Text,
} from '@/components';
import CreateService from '@/components/organism/CreateService';
import FindService from '@/components/organism/FindService';
import {useSafeAreaInsetsStyle} from '@/hooks/useSafeAreaInsetsStyle';
import {
  useGetServiceCategoriesQuery,
  useGetServicesQuery,
  useUpdateUserMutation,
} from '@/store/apiSlice';
import {setLocation} from '@/store/slice/locationSlice';
import {AppDispatch, RootState} from '@/store/store';
import theme from '@/theme';
import {colors} from '@/theme/colors';
import BottomSheet, {
  BottomSheetFlashList,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import Geolocation from '@react-native-community/geolocation';
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, PermissionsAndroid, Platform} from 'react-native';
import {promptForEnableLocationIfNeeded} from 'react-native-android-location-enabler';
import {useDispatch, useSelector} from 'react-redux';

type bottomSheetType = 'filter' | 'service' | '';
export const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const {accessToken, userId, profilePiture} = useSelector(
    (state: RootState) => state.user,
  );
  const [updateUser] = useUpdateUserMutation();
  const fetchCurrentLocation = async () => {
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        dispatch(setLocation({latitude, longitude}));
        try {
          const res = await updateUser({
            id: userId,
            userData: {location: {latitude, longitude}},
          }).unwrap();
        } catch (e) {
          console.log(e, 'what is err');
        }
      },
      error => console.log(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  const getToken = async (): Promise<string> => {
    return await messaging().getToken();
  };

  const requestNotificationPermissionAndroid = async (): Promise<void> => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted');
          const token = await getToken();
          console.log(token);
          if (accessToken && token) {
            //set the fcm token
            try {
              await updateUser({
                id: userId,
                userData: {fcmToken: token},
              }).unwrap();
            } catch (error) {
              console.log('failed to update user fcm token', updateUser);
            }
          }
        } else {
          console.log('Notification permission denied');
        }
      } catch (error) {
        console.error('Failed to request notification permission:', error);
      }
    } else {
      console.log(
        'Notification permission is not required for this Android version',
      );
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        fetchCurrentLocation();
      } else {
        console.warn('Location permission denied');
      }
    } else {
      Geolocation.requestAuthorization();
      fetchCurrentLocation();
    }
  };

  const enableLocationIfNeeded = async () => {
    try {
      if (Platform.OS === 'android') {
        const enabled = await promptForEnableLocationIfNeeded();
        if (enabled) {
          await requestLocationPermission();
        }
      } else {
        Geolocation.requestAuthorization();
        fetchCurrentLocation();
      }
    } catch (error) {
      console.error('Error enabling location', error);
    }
  };

  useEffect(() => {
    requestNotificationPermissionAndroid();
    enableLocationIfNeeded();
  }, []);

  const safeAreaInset = useSafeAreaInsetsStyle(['top']);
  const [selectedAction, setSelectedAction] = useState<string>('service');
  const bottomSheetModalRef = useRef<BottomSheet>(null);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<any[]>([]);
  const [bottomSheetFor, setBottomSheetFor] = useState<bottomSheetType>('');
  const [selectedCategory, setselectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const {data, isLoading, error, refetch, isFetching} = useGetServicesQuery({
    sortBy: '-createdAt',
    search: searchQuery,
    page: page,
    ...(selectedCategory && {category: selectedCategory}),
  });

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesErr,
  } = useGetServiceCategoriesQuery({});

  useEffect(() => {
    if (data) {
      if (page === 1) {
        setServices(data.results); // Reset services when new data comes in
      } else {
        setServices(prev => [...prev, ...data.results]);
      }
      setHasMore(data.page < data.totalPages);
      setIsFetchingMore(false);
    }
  }, [data, page]);

  const fetchMoreData = () => {
    if (hasMore && !isFetchingMore) {
      setIsFetchingMore(true);
      setPage(prevPage => prevPage + 1);
    }
  };

  if (isLoading || isFetching) {
    return (
      <Box justifyContent="center" alignItems="center" flex={1}>
        <ActivityIndicator size="large" />
      </Box>
    );
  }

  const openBottomSheet = (sheetFor: bottomSheetType) => {
    bottomSheetModalRef.current?.expand();
    setBottomSheetFor(sheetFor);
  };

  const renderBottomSheetContent = () => (
    <BottomSheetView style={{paddingBottom: 20, flex: 1}}>
      {bottomSheetFor === 'filter' ? (
        <Radio
          value={selectedCategory}
          onValueChange={(value: string) => {
            setselectedCategory(value);
            setSearch('');
            setSearchQuery('');
          }}>
          <BottomSheetFlashList
            data={categories?.results}
            keyExtractor={item => item?.id}
            renderItem={({item}) => (
              <HStack>
                <Radio.RadioButton value={item?.id} />
                <Text variant="b3regular">{item?.name}</Text>
              </HStack>
            )}
            estimatedItemSize={43.3}
          />
          <Button onPress={() => setselectedCategory('')} mx={5}>
            <Button.Text title="Clear Filter" />
          </Button>
        </Radio>
      ) : (
        <>
          <ContentSafeAreaView flexDirection="row" g={4}>
            <Button
              size="sm"
              flex={1}
              type={selectedAction === 'service' ? 'contained' : 'outlined'}
              onPress={() => setSelectedAction('service')}>
              <Button.Text title="Create a Service" />
            </Button>
            <Button
              size="sm"
              flex={1}
              onPress={() => setSelectedAction('find')}
              type={selectedAction === 'find' ? 'contained' : 'outlined'}>
              <Button.Text title="Request a service" />
            </Button>
          </ContentSafeAreaView>
          <Divider mt={4} borderWidth={0.5} />
          <BottomSheetScrollView>
            {selectedAction === 'service' && (
              <CreateService
                onPress={() => {
                  bottomSheetModalRef.current?.close();
                  refetch();
                }}
              />
            )}
            {selectedAction === 'find' && (
              <FindService
                onPress={() => {
                  bottomSheetModalRef.current?.close();
                  refetch();
                }}
              />
            )}
          </BottomSheetScrollView>
        </>
      )}
    </BottomSheetView>
  );

  return (
    <Screen preset="fixed">
      <Box style={safeAreaInset} bg="primary" />
      <Box
        elevation={5}
        bg="white"
        alignSelf="center"
        borderRadius="rounded-full"
        position="absolute"
        zIndex={20}
        bottom={theme.sizes.height / 40}
        right={10}>
        <IconButton
          onPress={
            bottomSheetFor
              ? () => {
                  bottomSheetModalRef?.current?.close();
                  setBottomSheetFor('');
                }
              : () => openBottomSheet('service')
          }
          icon={bottomSheetFor ? 'cancel' : 'add'}
          color={bottomSheetFor ? 'danger' : 'primary'}
          backgroundColor="white"
          iconStyle="outlined"
          variant="vector"
          size={12}
          type="material"
        />
      </Box>
      <Box
        flexDirection="row"
        g={4}
        bg="white"
        elevation={5}
        px={5}
        pt={5}
        py={3}>
        {accessToken ? (
          <Clickable
            borderWidth={3}
            borderColor="white"
            borderRadius="rounded-full"
            overflow="hidden">
            <Clickable
              onPress={() =>
                navigation.navigate('Public Profile', {id: userId})
              }>
              <FastImage
                source={{uri: profilePiture}}
                resizeMode="cover"
                width={40}
                height={40}
              />
            </Clickable>
          </Clickable>
        ) : null}
        <Input
          placeholder="Find What You Need"
          value={search}
          size="sm"
          onChangeText={text => setSearch(text)}
          right={() => (
            <IconButton
              padding={0}
              variant="vector"
              icon="search"
              color="primary"
              size={10}
              type="feather"
              onPress={() => setSearchQuery(search)}
            />
          )}
        />
        <HStack>
          <IconButton
            onPress={() => openBottomSheet('filter')}
            icon="filter"
            variant="svg"
            size={10}
            padding={0}
            color="primary"
          />
        </HStack>
      </Box>
      <ContentSafeAreaView flex={1}>
        <FlashList
          ListEmptyComponent={() => (
            <Text textAlign="center" mt={3} variant="heading3" color="black">
              No Service Found
            </Text>
          )}
          contentContainerStyle={{paddingTop: 10}}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={services}
          ItemSeparatorComponent={() => <Box mb={5} />}
          renderItem={({item}: {item: any}) => (
            <ServiceCard refetch={refetch} service={item} />
          )}
          keyExtractor={item => item._id ?? item.id}
          estimatedItemSize={200}
          onEndReached={fetchMoreData}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingMore ? (
              <Box justifyContent="center" alignItems="center" py={3}>
                <ActivityIndicator size="large" />
              </Box>
            ) : null
          }
        />
      </ContentSafeAreaView>

      <BottomSheet
        enableOverDrag={false}
        enableDynamicSizing={false}
        handleIndicatorStyle={{backgroundColor: colors.primary}}
        ref={bottomSheetModalRef}
        index={-1}
        enablePanDownToClose
        snapPoints={['100%']}>
        {renderBottomSheetContent()}
      </BottomSheet>
    </Screen>
  );
};

export default HomeScreen;
