import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { dev } from '../utils/console';
import AuthService from '../services/AuthService';
import { User as SupabaseAuthUser } from '@supabase/supabase-js';

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
  DELETING_SELF,
}

interface AuthControllerProps {
  setAppState: (state: AppState) => void;
  setAuthProviderUser: (user: SupabaseAuthUser | null) => void;
}

export const AuthController = ({
  setAppState,
  setAuthProviderUser,
}: Readonly<AuthControllerProps>) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | undefined>();

  const createAccount = async (): Promise<void> => {
    if (!email || !password) {
      dev('Email and password are required');
      setError('Email and password are required');
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
      setError('Error registering. Please try again.');
      setAppState(AppState.IDLE);
    }
  };

  const login = async (): Promise<void> => {
    if (!email || !password) {
      dev('Email and password are required');
      setError('Email and password are required');
      return;
    }

    setError(undefined);
    setAppState(AppState.LOGGING_IN);

    try {
      const user = await AuthService.login(email, password);
      setAuthProviderUser(user);
      // Since we will have the user and the token stored in storage from the AuthService.login call, we can transition states
      setAppState(AppState.CONFIGURING_NETWORK);
    } catch (err) {
      dev('Error logging in:', err);
      setError('Error logging in. Please try again.');
      setAppState(AppState.IDLE);
    }
  };

  return (
    <View style={styles.sectionContainer}>
      <TextInput onChangeText={setEmail} placeholder="Email" />
      <TextInput
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry={true}
      />
      <View style={{ height: 20 }} />
      <Pressable
        disabled={!email || !password}
        onPress={createAccount}
        style={{ margin: 8, padding: 8 }}>
        <Text>Create an Account</Text>
      </Pressable>
      <Pressable
        disabled={!email || !password}
        onPress={login}
        style={{ margin: 8, padding: 8 }}>
        <Text>Sign In</Text>
      </Pressable>
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flexGrow: 1,
    marginTop: 32,
    paddingHorizontal: 24,
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
});
