/* eslint-disable react-native/no-inline-styles */
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

type QueryPropsType = {
  sortBy: string;
  search?: string;
  page: number;
  category?: number;
};

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
        if (userId) {
          try {
            await updateUser({
              id: userId,
              userData: {location: {latitude, longitude}},
            }).unwrap();
          } catch (e) {
            console.log(e);
          }
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
          const token = await getToken();
          if (accessToken && token) {
            //set the fcm token
            try {
              await updateUser({
                id: userId,
                userData: {fcmToken: token},
              }).unwrap();
            } catch (er) {
              console.log('failed to update user fcm token', updateUser);
            }
          }
        } else {
          console.log('Notification permission denied');
        }
      } catch (err) {
        console.error('Failed to request notification permission:', err);
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
    } catch (e) {
      console.error('Error enabling location', e);
    }
  };

  useEffect(() => {
    const initPermissions = async () => {
      await requestNotificationPermissionAndroid();
      // Wait briefly before requesting location
      await new Promise(resolve => setTimeout(resolve, 1000));
      await enableLocationIfNeeded();
    };

    initPermissions();
  }, []);

  const safeAreaInset = useSafeAreaInsetsStyle(['top']);
  const [selectedAction, setSelectedAction] = useState<string>('service');
  const bottomSheetModalRef = useRef<BottomSheet>(null);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<any[]>([]);
  const [bottomSheetFor, setBottomSheetFor] = useState<bottomSheetType>('');
  const [selectedCategory, setselectedCategory] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [query, setQuery] = useState({
    sortBy: '-createdAt',
    search: '',
    page: 1,
  });
  const {data, isLoading, isFetching, refetch} =
    useGetServicesQuery<QueryPropsType>(query);

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesErr,
  } = useGetServiceCategoriesQuery({});

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !isFetching) {
      setLoadingMore(true);
      setQuery(prev => ({...prev, page: prev.page + 1}));
    }
  };
  const PAGE_SIZE = 10;

  useEffect(() => {
    if (data) {
      if (query.page === 1) {
        setServices(data.results);
      } else {
        setServices(prev => [...prev, ...data.results]);
      }

      // 👇 Set hasMore based on how many items returned
      setHasMore(data.results.length === PAGE_SIZE);
    }
  }, [data]);

  useEffect(() => {
    if (!isFetching) {
      setLoadingMore(false);
    }
  }, [isFetching]);

  const openBottomSheet = (sheetFor: bottomSheetType) => {
    bottomSheetModalRef.current?.expand();
    setBottomSheetFor(sheetFor);
  };

  const renderBottomSheetContent = () => (
    <BottomSheetView style={{paddingBottom: 20, flex: 1}}>
      {bottomSheetFor === 'filter' ? (
        <ContentSafeAreaView flex={1}>
          <Text mb={5}>Filter By Category</Text>
          <BottomSheetFlashList
            numColumns={3}
            ItemSeparatorComponent={() => (
              <Box height={theme.sizes.sideSpace / 3} />
            )}
            data={categories?.results}
            extraData={[1]}
            keyExtractor={item => item?.id}
            renderItem={({item}) => (
              <Box width={theme.sizes.safeWidth / 3} alignItems="center">
                <Button
                  onPress={() => {
                    setselectedCategory(item?.id);
                    setBottomSheetFor('');
                    setQuery(prev => ({
                      ...prev,
                      category: item?.id,
                      page: 1,
                      search: '',
                    }));
                    bottomSheetModalRef?.current?.close();
                  }}
                  type={
                    selectedCategory === item?.id ? 'contained' : 'outlined'
                  }
                  size="sm"
                  width={theme.sizes.safeWidth / 3.2}>
                  <Button.Text title={item?.name} />
                </Button>
              </Box>
            )}
            estimatedItemSize={43.3}
          />
          <Button onPress={() => setselectedCategory('')} mx={5}>
            <Button.Text title="Clear Filter" />
          </Button>
        </ContentSafeAreaView>
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
                  setBottomSheetFor('');
                }}
              />
            )}
            {selectedAction === 'find' && (
              <FindService
                onPress={() => {
                  bottomSheetModalRef.current?.close();
                  refetch();
                  setBottomSheetFor('');
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
                  bottomSheetModalRef?.current?.coll();
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
          onChangeText={text => {
            setSearch(text);
            setQuery(prev => ({
              ...prev,
              page: 1,
              search: text,
            }));
          }}
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
      <ContentSafeAreaView flex={1} mt={2}>
        <FlashList
          data={services}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <ServiceCard refetch={refetch} service={item} />
          )}
          keyExtractor={item => item._id ?? item.id}
          estimatedItemSize={200}
          ItemSeparatorComponent={() => <Box mb={5} />}
          ListEmptyComponent={() => (
            <>
              {!isLoading && (
                <Text
                  textAlign="center"
                  mt={3}
                  variant="heading3"
                  color="black">
                  No Service Found
                </Text>
              )}
            </>
          )}
          ListFooterComponent={
            loadingMore ? (
              <Box py={5}>
                <ActivityIndicator color={colors.primary} size="large" />
              </Box>
            ) : null
          }
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
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
