import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AuthService from '../services/AuthService';

const AppTabs = createBottomTabNavigator();

function AppTabNavigator(): React.JSX.Element {
  return (
    <AppTabs.Navigator>
      <AppTabs.Screen name="Home" component={Home} />
      <AppTabs.Screen name="Settings" component={Settings} />
    </AppTabs.Navigator>
  );
}

export default AppTabNavigator;

const Home = () => {
  return (
    <View>
      <Text>Home</Text>
    </View>
  );
};

const Settings = () => {
  const logout = async () => {
    // Call the logout function from the AuthService
    await AuthService.logout();
  };
  return (
    <View>
      <Pressable onPress={logout}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
};
