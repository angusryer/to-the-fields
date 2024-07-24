import React from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from 'react-native';
import { dev } from '../utils/console';
import AuthService from '../services/AuthService';
import { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/Buttons';
import { t } from 'i18next';
import { ErrorMessage } from '../components/ErrorMessage';
import { radii, spaces, useStyles } from '../utils/theme';
import { Input } from '../components/Inputs';

export enum AuthState {
  UNAUTHENTICATED,
  AUTHENTICATED,
}

export enum AppState {
  /**
   * The app is initializing. This is the default state.
   */
  INITIALIZING,
  /**
   * The app is configuring the network.
   */
  CONFIGURING_NETWORK,
  /**
   * The app is navigating to a new screen.
   */
  NAVIGATING,
  /**
   * The app is idle.
   */
  IDLE,
  REGISTERING,
  LOGGING_IN,
  LOGGING_OUT,
  RESETTING_PASSWORD,
}

interface AuthControllerProps {
  appState: AppState;
  setAppState: (state: AppState) => void;
  setAuthProviderUser: (user: SupabaseAuthUser | null) => void;
}

export const AuthController = ({
  appState,
  setAppState,
  setAuthProviderUser,
}: Readonly<AuthControllerProps>) => {
  const { t } = useTranslation(['common', 'auth']);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | undefined>();
  const [info, setInfo] = React.useState<string | undefined>();

  const createAccount = async (): Promise<void> => {
    if (!email || !password) {
      setError(t('register.required', { ns: 'auth' }));
      return;
    }

    setError(undefined);
    setAppState(AppState.REGISTERING);

    try {
      const user: SupabaseAuthUser | null = await AuthService.register(
        email,
        password,
      );
      setAuthProviderUser(user);
      // Since we will have the user and the token stored in storage from the AuthService.login call, we can transition states
      setAppState(AppState.CONFIGURING_NETWORK);
    } catch (err) {
      dev('Error registering:', err);
      setError(t('register.error', { ns: 'auth' }));
      setAppState(AppState.IDLE);
    }
  };

  const login = async (): Promise<void> => {
    if (!email || !password) {
      dev('Email and password are required');
      setError(t('login.required', { ns: 'auth' }));
      return;
    }

    setError(undefined);
    setAppState(AppState.LOGGING_IN);

    try {
      const user = await AuthService.login(email, password);
      setAuthProviderUser(user);
      // Since we will have the user and the token stored in storage from the AuthService.login call, we can transition states
      setAppState(AppState.CONFIGURING_NETWORK);
    } catch (err: any) {
      if (err?.message?.includes('Incorrect credentials')) {
        setError(t('login.incorrect', { ns: 'auth' }));
      } else {
        setError('Error logging in. Please try again.');
      }
      setAppState(AppState.IDLE);
    }
  };

  const forgotPassword = async (): Promise<void> => {
    if (!email) {
      setError(t('reset.required', { ns: 'auth' }));
      return;
    }

    setError(undefined);
    setInfo(undefined);
    setAppState(AppState.RESETTING_PASSWORD);

    try {
      await AuthService.forgotPassword(email);
      setError(undefined);
      setInfo(t('reset.sent', { ns: 'auth' }));
      setAppState(AppState.IDLE);
    } catch (err) {
      dev('Error resetting password:', err);
      setError(t('reset.error', { ns: 'auth' }));
      setAppState(AppState.IDLE);
    }
  };

  const disabled = shouldBeDisabled(email, password, appState);

  return (
    <ScrollView
      style={styles.sectionContainer}
      contentContainerStyle={styles.sectionContentContainer}>
      <KeyboardAvoidingView>
        <Input
          inputMode="email"
          onChangeText={setEmail}
          placeholder={t('login.email', { ns: 'auth' })}
        />
        <Input
          inputMode="text"
          onChangeText={setPassword}
          placeholder={t('login.password', { ns: 'auth' })}
          secureTextEntry={true}
        />
        <ErrorMessage>{error}</ErrorMessage>
        <Button onPress={login} pressableProps={{ disabled }}>
          {t('login.submit', { ns: 'auth' })}
        </Button>
        <Button onPress={createAccount} pressableProps={{ disabled }}>
          {t('login.register', { ns: 'auth' })}
        </Button>
        <Button
          onPress={forgotPassword}
          pressableProps={{ disabled: appState !== AppState.IDLE }}>
          {t('login.forgot', { ns: 'auth' })}
        </Button>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const shouldBeDisabled = (
  email: string,
  password: string,
  appState: AppState,
) => {
  return (!email || !password) && appState !== AppState.IDLE;
};

const styles = StyleSheet.create({
  sectionContainer: {
    flexGrow: 1,
    marginTop: spaces[32],
    paddingHorizontal: spaces[24],
  },
  sectionContentContainer: {
    marginTop: 32,
    paddingHorizontal: spaces[6],
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  botton: {
    margin: 8,
    padding: 8,
    backgroundColor: 'blue',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
  },
  bottonText: {
    color: 'white',
  },
});
