import React from 'react';
import {View, StyleSheet} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {Box, ContentSafeAreaView, Divider, FastImage, HStack, Text, VStack} from '@/components';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import {useGeUserQuery, useLogoutMutation} from '@/store/apiSlice';
import { getImageUrl } from '@/helper/image';
import { toast } from 'sonner-native';
import { signOut } from '@/store/slice/userSlice';

type DrawerItemProps = {
  icon: string;
  label: string;
  navigateTo: string;
};

const DrawerList: DrawerItemProps[] = [
  {icon: 'account', label: 'Account Details', navigateTo: 'Account Info'},
  {icon: 'account-group', label: 'Manage Account', navigateTo: 'Manage Account'},
  {icon: 'account-key', label: 'Change Password', navigateTo: 'Change Password'},
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
  const {userId,refreshToken} = useSelector((state: RootState) => state.user);
  const {data: user, isLoading: isUserLoading} = useGeUserQuery({userId});
  const navigation = useNavigation();
  const dispatch = useDispatch();
const [logout,{isLoading}] = useLogoutMutation();

  const handleSignOut = async ()=>{
    try {
      const res = await logout({refreshToken}).unwrap();
      toast.success('Logout successfull!',{duration:2000});
      dispatch(signOut());
      navigation.navigate('Login');

    } catch (error) {
      toast.error(error || 'Failed to logout',{duration:2000});
    }
  };
  return (
    <Box flex={1}>
      <DrawerContentScrollView {...props}>
        <ContentSafeAreaView>
         <HStack g={3}>
         <FastImage
            width={40}
            height={40}
            borderRadius="rounded-full"

            source={{uri: getImageUrl(user?.profilePicture)}}
          />
          <VStack>
            <Text variant="heading3" numberOfLines={1}>
              {user?.name}
            </Text>
            <Text>{user?.professions?.[0]?.name}</Text>
          </VStack>
         </HStack>
         <Divider mt={5} borderColor="primary50"/>
        </ContentSafeAreaView>
        <DrawerItems />
      </DrawerContentScrollView>
      <DrawerItem
      onPress={handleSignOut}
      inactiveTintColor="red"
        icon={({color, size}) => (
          <Icon name="exit-to-app" color={color} size={size} />
        )}
        label="Sign Out"
      />
    </Box>
  );
};

export default DrawerContent;
