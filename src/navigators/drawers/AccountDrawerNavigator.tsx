import {createDrawerNavigator} from '@react-navigation/drawer';
import * as React from 'react';
import {AccountStack} from '../stacks/AccountStack';
import DrawerContent from '@/screens/authenticated/account/DrawerContent';

const Drawer = createDrawerNavigator();

export default function AccountDrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Account"
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="Account" component={AccountStack} />
    </Drawer.Navigator>
  );
}
