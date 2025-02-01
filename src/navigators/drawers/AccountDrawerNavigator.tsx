import AccountInfoScreen from '@/screens/authenticated/account/AccountInfoScreen';
import ManageAccountScreen from '@/screens/authenticated/account/ManageAccountScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as React from 'react';

const Drawer = createDrawerNavigator();


export default function AccountDrawerNavigator() {
  return (
      <Drawer.Navigator initialRouteName="AccountInfo"
      screenOptions={{
        // headerShown: false,
      }}
      >
        <Drawer.Screen name="AccountInfo" component={AccountInfoScreen} />
        <Drawer.Screen name="Manage Profile" component={ManageAccountScreen} />
      </Drawer.Navigator>
  );
}
