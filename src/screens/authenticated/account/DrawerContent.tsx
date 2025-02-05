import React from 'react';
import {View, StyleSheet} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {Box, ContentSafeAreaView, Divider, FastImage, HStack, Text, VStack} from '@/components';
import {useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import {useGeUserQuery} from '@/store/apiSlice';

type DrawerItemProps = {
  icon: string;
  label: string;
  navigateTo: string;
};

const DrawerList: DrawerItemProps[] = [
  {icon: 'account', label: 'Account Details', navigateTo: 'Account Info'},
  {icon: 'account-multiple', label: 'Profile', navigateTo: 'Account Info'},
  {icon: 'account-group', label: 'User', navigateTo: 'User'},
  {icon: 'bookshelf', label: 'Library', navigateTo: ''},
];

const DrawerLayout: React.FC<DrawerItemProps> = ({icon, label, navigateTo}) => {
  const navigation = useNavigation();

  return (
    <DrawerItem
      icon={({color, size}) => <Icon name={icon} color={color} size={size} />}
      label={label}
      onPress={() => {
        navigation.navigate(navigateTo as never);
      }}
    />
  );
};

const DrawerItems: React.FC = () => {
  return (
    <>
      {DrawerList.map((el, i) => (
        <DrawerLayout
          key={i}
          icon={el.icon}
          label={el.label}
          navigateTo={el.navigateTo}
        />
      ))}
    </>
  );
};

const DrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const {userId} = useSelector((state: RootState) => state.user);
  const {data: user, isLoading: isUserLoading} = useGeUserQuery({userId});
  return (
    <Box flex={1}>
      <DrawerContentScrollView {...props}>
        <ContentSafeAreaView>
         <HStack g={3}>
         <FastImage
            width={40}
            height={40}
            source={{uri: user?.profilePicture}}
          />
          <VStack>
            <Text variant="heading3" numberOfLines={1}>
              {user?.name}
            </Text>
            <Text>Technician</Text>
          </VStack>
         </HStack>
         <Divider mt={5} borderColor="primary50"/>
        </ContentSafeAreaView>
        <DrawerItems />
      </DrawerContentScrollView>
      <DrawerItem
        icon={({color, size}) => (
          <Icon name="exit-to-app" color={color} size={size} />
        )}
        label="Sign Out"
      />
    </Box>
  );
};

export default DrawerContent;
