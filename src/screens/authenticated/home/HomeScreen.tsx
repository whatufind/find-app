/* eslint-disable react/no-unstable-nested-components */
import {
  Badge,
  Box,
  Button,
  ContentSafeAreaView,
  Divider,
  HStack,
  IconButton,
  Input,
  List,
  Radio,
  Screen,
  ServiceCard,
  Text,
} from '@/components';
import CreateService from '@/components/organism/CreateService';
import FindService from '@/components/organism/FindService';
import {
  useGetServiceCategoriesQuery,
  useGetServicesQuery,
} from '@/store/apiSlice';
import theme from '@/theme';
import {colors} from '@/theme/colors';
import BottomSheet, {
  BottomSheetFlashList,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {FlashList} from '@shopify/flash-list';
import React, {useRef, useState} from 'react';
import {ActivityIndicator} from 'react-native';

type bottomSheetType = 'filter' | 'service' | '';
export const HomeScreen = () => {
  const [selectedAction, setSelectedAction] = useState<string>('service');
  const bottomSheetModalRef = useRef<BottomSheet>(null);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [bottomSheetFor, setBottomSheetFor] = useState<bottomSheetType>('');
  const [selectedCategory, setselectedCategory] = useState('');

  const {data, isLoading, error} = useGetServicesQuery({
    sortBy: '-createdAt',
    search: searchQuery,
    ...(selectedCategory && {category: selectedCategory}),
  });

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesErr,
  } = useGetServiceCategoriesQuery({});

  if (isLoading) {
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
              <Button.Text title="Provide a Service" />
            </Button>
            <Button
              size="sm"
              flex={1}
              onPress={() => setSelectedAction('find')}
              type={selectedAction === 'find' ? 'contained' : 'outlined'}>
              <Button.Text title="Take a service" />
            </Button>
          </ContentSafeAreaView>
          <Divider mt={4} borderWidth={0.5} />
          <BottomSheetScrollView>
            {selectedAction === 'service' && <CreateService />}
            {selectedAction === 'find' && <FindService />}
          </BottomSheetScrollView>
        </>
      )}
    </BottomSheetView>
  );

  return (
    <Screen preset="fixed">
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
          onPress={() => openBottomSheet('service')}
          icon="create"
          color="primary"
          backgroundColor="white"
          iconStyle="contained"
          variant="vector"
          size={12}
          type="material"
        />
      </Box>
      <Box flexDirection="row" bg="primary" px={5} pt={5} py={3}>
        <Input
          placeholder="Find What You Need"
          value={search}
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
        <HStack g={2}>
          <Badge content="0" placement="topRight" variant="danger">
            <IconButton
              variant="vector"
              icon="notifications"
              color="white"
              size={10}
              type="ionicon"
            />
          </Badge>
          <IconButton
            onPress={() => openBottomSheet('filter')}
            icon="filter-variant"
            type="materialCommunity"
            variant="vector"
            size={10}
            padding={0}
            color="white"
          />
        </HStack>
      </Box>
      <ContentSafeAreaView flex={1}>
        <FlashList
          contentContainerStyle={{paddingTop: 10}}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={data?.results}
          ItemSeparatorComponent={() => <Box mb={5} />}
          renderItem={({item}: {item: any}) => <ServiceCard service={item} />}
          keyExtractor={item => item._id ?? item.id}
          estimatedItemSize={200}
        />
      </ContentSafeAreaView>

      <BottomSheet
        enableOverDrag={false}
        enableDynamicSizing={false}
        handleIndicatorStyle={{backgroundColor: colors.primary}}
        ref={bottomSheetModalRef}
        index={-1}
        enablePanDownToClose
        snapPoints={[theme.sizes.height / 1.5]}>
        {renderBottomSheetContent()}
      </BottomSheet>
    </Screen>
  );
};

export default HomeScreen;
