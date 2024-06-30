type RootStackScreens =
  | 'AuthController'
  | 'OnboardingStackNavigator'
  | 'AppTabNavigator';

interface INavigationProps<
  ParamList extends ParamListBase = {},
  RouteName extends string = RootStackScreens,
> {
  route: RouteProp<ParamList, RouteName>;
  navigation: any;
}

type RootStackParamsList = {
  AuthController: undefined;
  OnboardingStackNavigator: undefined;
  AppTabNavigator: undefined;
};
