import React from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { dev } from '../utils/console';
import AuthService from '../services/AuthService';
import { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { ScrollView } from 'react-native-gesture-handler';

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
    } catch (err: any) {
      if (err?.message?.includes('Incorrect credentials')) {
        setError('Incorrect password or email.');
      } else {
        setError('Error logging in. Please try again.');
      }
      setAppState(AppState.IDLE);
    }
  };

  const forgotPassword = async (): Promise<void> => {
    if (!email) {
      dev('Email is required');
      setError('Email is required.');
      return;
    }

    setError(undefined);
    setAppState(AppState.RESETTING_PASSWORD);

    try {
      await AuthService.forgotPassword(email);
      setError('Password reset email sent.');
      setAppState(AppState.IDLE);
    } catch (err) {
      dev('Error resetting password:', err);
      setError('Error resetting password. Please try again.');
      setAppState(AppState.IDLE);
    }
  };

  return (
    <ScrollView>
      <KeyboardAvoidingView style={styles.sectionContainer}>
        <TextInput
          onChangeText={setEmail}
          placeholder="Email"
          autoFocus
          style={styles.textBox}
        />
        <TextInput
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={true}
          style={styles.textBox}
        />
        {error && <Text style={{ color: 'red' }}>{error}</Text>}
        <View style={{ flexGrow: 1 }} />
        <Pressable
          disabled={!email || !password}
          onPress={createAccount}
          style={styles.botton}>
          <Text style={styles.bottonText}>Create an Account</Text>
        </Pressable>
        <Pressable
          disabled={!email || !password}
          onPress={login}
          style={styles.botton}>
          <Text style={styles.bottonText}>Sign In</Text>
        </Pressable>
        <Pressable onPress={forgotPassword} style={styles.botton}>
          <Text style={styles.bottonText}>Forgot password?</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sectionContentContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
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
  textBox: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 8,
    margin: 8,
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
