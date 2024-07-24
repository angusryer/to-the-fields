// src/types/react-navigation.d.ts

import { ParamListBase, RouteProp } from '@react-navigation/native';

declare module '@react-navigation/native' {
  export type RootStackScreens =
    | 'AuthController'
    | 'OnboardingStackNavigator'
    | 'AppTabNavigator';

  export interface INavigationProps<
    ParamList extends ParamListBase = {},
    RouteName extends keyof ParamList = string,
  > {
    route: RouteProp<ParamList, RouteName>;
    navigation: any;
  }

  export type RootStackParamsList = {
    AuthController: undefined;
    OnboardingStackNavigator: undefined;
    AppTabNavigator: undefined;
  };

  export type Theme = {
    dark: boolean;
    colors: {
      primary: string;
      darkPrimary: string;
      lightPrimary: string;
      darkSecondary: string;
      lightSecondary: string;
      background: string;
      neutral: string;
      card: string;
      text: string;
      border: string;
      notification: string;
      error: string;
      warning: string;
      success: string;
      info: string;
    };
  };
}
