import React from 'react';
import { AuthController } from '../controllers/AuthController';
import { dev } from '../utils/console';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Pressable } from 'react-native';
import HttpService from '../services/HttpService';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import { routes } from 'shared';

const OnboardingStack = createNativeStackNavigator();

function OnboardingStackNavigator(): React.JSX.Element {
  return (
    <OnboardingStack.Navigator>
      <OnboardingStack.Screen
        name="SelectAccountPurpose"
        component={SelectAccountPurpose}
      />
      <OnboardingStack.Screen
        name="FinishRegistration"
        component={FinishRegistration}
      />
    </OnboardingStack.Navigator>
  );
}

export default OnboardingStackNavigator;

const SelectAccountPurpose = ({ navigation }: INavigationProps) => {
  const nextScreen = () => {
    dev('Navigating to next screen');
    // Check if user selections are valid
    navigation.navigate('FinishRegistration');
  };

  return (
    <View>
      <Text>Are you a parent? Do you want to organize a league?</Text>
      <Pressable onPress={nextScreen}>
        <Text>Continue</Text>
      </Pressable>
    </View>
  );
};

const FinishRegistration = ({ navigation }: INavigationProps) => {
  const register = async () => {
    dev('Registering...');
    try {
      const result = await HttpService.post(routes.auth.register, {});
      dev('Result:', result);
      navigation.navigate('AppTabNavigator');
    } catch (error) {
      dev('Error:', error);
    }
  };

  return (
    <View>
      <Text>Finish registration</Text>
      <Pressable onPress={register}>
        <Text>Finish Registration</Text>
      </Pressable>
    </View>
  );
};
