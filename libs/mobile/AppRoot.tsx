import React, { Suspense, useCallback, useEffect, useMemo } from 'react';
import 'react-native-url-polyfill/auto';
import { StatusBar, Text, View, useColorScheme } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  NavigationContainer,
  NavigationProp,
  Theme,
  ThemeProvider,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingStackNavigator from './src/navigators/OnboardingStackNavigator';
import AppTabNavigator from './src/navigators/AppTabNavigator';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppState, AuthController } from './src/controllers/AuthController';
import Box from './src/components/Box';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SecureStorageService from './src/services/SecureStorageService';
import { dev } from './src/utils/console';
import HttpService from './src/services/HttpService';
import AuthService from './src/services/AuthService';
import { User as SupabaseAuthUser } from '@supabase/supabase-js';

const queryClient = new QueryClient();
const RootStack = createNativeStackNavigator();

interface SplashScreenProps {
  appState?: AppState;
}

function SplashScreen({
  appState,
}: Readonly<SplashScreenProps>): React.JSX.Element {
  if (appState === AppState.INITIALIZING) {
    return <Text>Initializing...</Text>;
  }

  if (appState === AppState.CONFIGURING_NETWORK) {
    return <Text>Configuring network...</Text>;
  }

  if (appState === AppState.NAVIGATING) {
    return <Text>Navigating...</Text>;
  }

  if (appState === AppState.LOGGING_IN) {
    return <Text>Logging in...</Text>;
  }

  if (appState === AppState.LOGGING_OUT) {
    return <Text>Logging out...</Text>;
  }

  if (appState === AppState.REGISTERING) {
    return <Text>Registering your account...</Text>;
  }

  if (appState === AppState.IDLE) {
    return <Text>Idle.</Text>;
  }

  return (
    <View>
      <Text>Unknown state</Text>
    </View>
  );
}

interface LayoutRootProps {
  children: React.ReactNode;
  theme: Theme;
}

function LayoutRoot({
  children,
  theme,
}: Readonly<LayoutRootProps>): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
          <Box.Screen>{children}</Box.Screen>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const isInAppState = (checkState: AppState, appState: AppState): boolean => {
  switch (checkState) {
    case AppState.INITIALIZING:
      return appState === AppState.INITIALIZING;
    case AppState.CONFIGURING_NETWORK:
      return appState === AppState.CONFIGURING_NETWORK;
    case AppState.NAVIGATING:
      return appState === AppState.NAVIGATING;
    case AppState.REGISTERING:
      return appState === AppState.REGISTERING;
    case AppState.LOGGING_IN:
      return appState === AppState.LOGGING_IN;
    case AppState.LOGGING_OUT:
      return appState === AppState.LOGGING_OUT;
    case AppState.IDLE:
      return appState === AppState.IDLE;
    default:
      return false;
  }
};

function NavigationRoot(): React.JSX.Element {
  const httpInterceptor = React.useRef<number>(0);
  const nav = useNavigation<NavigationProp<RootStackParamsList>>();

  // The user data from the external auth provider service. "null" means the user is not logged in.
  const [authProviderUser, setAuthProviderUser] =
    React.useState<SupabaseAuthUser | null>(null);

  const [appState, setAppState] = React.useState<AppState>(
    AppState.INITIALIZING,
  );

  // Close the appSate in a closure and return a function that checks if the appState is the same as the checkState
  const _isInAppState = React.useCallback(
    (checkState: AppState) => {
      return isInAppState(checkState, appState);
    },
    [appState],
  );
  // Initialize the auth user state by checking for a valid token
  useEffect(() => {
    if (_isInAppState(AppState.INITIALIZING)) {
      dev('Initializing app.');
      // If there is no authProviderUser and we are starting up, check if there is a token in storage
      AuthService.checkForExistingUser()
        .then((authProviderUser: SupabaseAuthUser | null) => {
          if (authProviderUser) {
            dev(
              'Existing authProviderUser found:',
              JSON.stringify(authProviderUser, null, 2),
            );
            setAuthProviderUser(authProviderUser);
            setAppState(AppState.CONFIGURING_NETWORK);
          } else {
            dev('No existing authProviderUser found.');
            setAppState(AppState.IDLE);
          }
        })
        .catch((err) => {
          dev('Error checking for existing authProviderUser:', err);
          setAppState(AppState.IDLE);
        });
    }
  }, []);

  // Set up the HTTP request interceptor with the locally stored authorization token
  useEffect(() => {
    if (_isInAppState(AppState.CONFIGURING_NETWORK)) {
      // If we are not starting up and there is an authProviderUser,
      // then the
      SecureStorageService.get().then((token: string | null) => {
        dev('Configuring HTTP request interceptor with authorization token.');
        if (token) {
          // Add the token to the request headers
          httpInterceptor.current = HttpService.client.interceptors.request.use(
            (config) => {
              config.headers.Authorization = `Bearer ${token}`;
              return config;
            },
            (error) => {
              return Promise.reject<Error>(new Error(error));
            },
          );
          setAppState(AppState.NAVIGATING);
        } else {
          // No token? Remove the token from the request headers
          HttpService.client.interceptors.request.eject(
            httpInterceptor.current,
          );
        }
      });
    }

    return () => {
      // Remove the token from the request headers when dismounting
      HttpService.client.interceptors.request.eject(httpInterceptor.current);
    };
  }, [authProviderUser, appState]);

  /**
   * Check if the user has been flagged as registered in the external auth provider service.
   * If they are, navigate to the AppTabNavigator. If they are not, navigate to the OnboardingStackNavigator.
   */
  useEffect(() => {
    if (_isInAppState(AppState.NAVIGATING)) {
      if (authProviderUser?.user_metadata?.registered) {
        dev('User is registered. Navigating to AppTabNavigator.');
        setAppState(AppState.IDLE);
        nav.reset({
          index: 0,
          routes: [{ name: 'AppTabNavigator' }],
        });
      } else {
        dev('User is not registered. Navigating to OnboardingStackNavigator.');
        setAppState(AppState.IDLE);
        nav.reset({
          index: 0,
          routes: [{ name: 'OnboardingStackNavigator' }],
        });
      }
    }
  }, [appState, authProviderUser]);

  useEffect(() => {
    AuthService.authClient.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        dev('User is signed out.');
        nav.reset({
          index: 0,
          routes: [{ name: 'AuthController' }],
        });
        setAppState(AppState.IDLE);
      }
    });
  }, []);

  return (
    <>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="AuthController">
          {() => (
            <AuthController
              setAppState={setAppState}
              setAuthProviderUser={setAuthProviderUser}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name="OnboardingStackNavigator"
          component={OnboardingStackNavigator}
        />
        <RootStack.Screen name="AppTabNavigator" component={AppTabNavigator} />
      </RootStack.Navigator>
      <SplashScreen appState={appState} />
    </>
  );
}

/**
 * AppRoot controls the flow of the app based on the user's authentication state.
 * It sets up the HTTP interceptor to add the token to the request headers.
 * It also checks if the user has been flagged as registered in the external auth provider service.
 * If they are, it navigates to the AppTabNavigator. If they are not, it navigates to the OnboardingStackNavigator.
 * App transition should proceed as follows:
 *
 * INITIALIZING -> CONFIGURING_NETWORK -> NAVIGATING -> IDLE
 *
 */

function AppRoot(): React.JSX.Element {
  const deviceScheme = useColorScheme();
  const theme: Theme = useMemo(
    () => ({
      dark: deviceScheme === 'dark',
      colors: colors[deviceScheme ?? 'light'],
    }),
    [deviceScheme],
  );

  return (
    <Suspense fallback={<SplashScreen />}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={theme}>
          <LayoutRoot theme={theme}>
            <NavigationContainer theme={theme}>
              <NavigationRoot />
            </NavigationContainer>
          </LayoutRoot>
        </ThemeProvider>
      </QueryClientProvider>
    </Suspense>
  );
}

export default AppRoot;

const colors: { dark: Theme['colors']; light: Theme['colors'] } = {
  dark: {
    primary: '#1E90FF', // DodgerBlue
    background: '#121212', // Dark Gray
    card: '#1E1E1E', // Slightly lighter dark gray
    text: '#FFFFFF', // White
    border: '#272727', // Medium Gray
    notification: '#32CD32', // LimeGreen
  },
  light: {
    primary: '#1E90FF', // DodgerBlue
    background: '#FFFFFF', // White
    card: '#F8F8F8', // Light Gray
    text: '#000000', // Black
    border: '#DDDDDD', // Light Gray
    notification: '#32CD32', // LimeGreen
  },
};
