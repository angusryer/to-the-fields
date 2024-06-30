import { User as SupabaseAuthUser, createClient } from '@supabase/supabase-js';
import Config from 'react-native-config';
import { Platform } from 'react-native';
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';
import SecureStorage from './SecureStorageService';
import { User, routes } from 'shared';
import { dev } from '../utils/console';
import Http from './HttpService';
import { jwtDecode } from 'jwt-decode';

/**
 *
 * NOTE: AuthService depends on SecureStorageService
 *
 *
 * Service to handle all authentication related actions. Includes registration, login, logout, and session checks.
 * This service also handles storing the user token in secure storage.
 */
class AuthService {
  private _authClient: SupabaseAuthClient | undefined = undefined;

  constructor() {
    const supabaseUrl = __DEV__
      ? Platform.select({
          ios: Config.SUPABASE_IOS_URL,
          android: Config.SUPABASE_ANDROID_URL,
        })
      : Config.SUPABASE_URL;

    if (!supabaseUrl) {
      throw new Error(
        'SUPABASE_URL environment variable is not available for ' + Platform.OS,
      );
    }

    const supabaseKey = Config.SUPABASE_ANON_KEY;
    if (!supabaseKey) {
      throw new Error(
        'SUPABASE_CLIENT_KEY environment variable is not available',
      );
    }

    const { auth } = createClient(supabaseUrl, supabaseKey);
    this._authClient = auth;
  }

  public get authClient() {
    if (!this._authClient) {
      throw new Error('Supabase authClient is not available');
    }
    return this._authClient;
  }

  private get secureStorage() {
    if (!SecureStorage) {
      throw new Error('Secure storage is not available');
    }
    return SecureStorage;
  }

  // We must store a token with its expiry date in the secure storage
  // and check if the token is still valid before making a request. This
  // way we can ensure the user is authenticated when offline.
  /**
   * Check if there is an existing local user session, check if it is still valid,
   * and return the user data if it is.
   */
  public async checkForExistingUser(): Promise<SupabaseAuthUser | null> {
    let decodedToken: any;
    const token = (await this.secureStorage.get()) ?? undefined;
    if (!token) {
      dev('No existing session token stored locally. Checking remote.');
    } else {
      dev('Existing session token found in secure storage. Checking expiry.');
      decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        dev('Token has expired. Removing from secure storage.');
        await this.secureStorage.remove();
        return null;
      }
    }

    const { data, error } = await this.authClient.getUser(token);

    if (error) {
      if (error.name === 'AuthSessionMissingError') {
        dev('No existing session found on remote.');
        await this.secureStorage.remove();
        return null;
      } else {
        throw new Error(
          'api/auth > Error fetching existing user: ' +
            JSON.stringify(error, null, 2),
        );
      }
    }

    if (!data?.user) {
      dev('No existing user session found on remote.');
      return null;
    }

    return data.user;
  }

  /**
   * Register a new user with the external auth provider service and store the token in local secure storage.
   * @returns The user data from the external auth provider service.
   */
  public async register(
    email: string,
    password: string,
  ): Promise<SupabaseAuthUser | null> {
    const { data, error } = await this.authClient.signUp({
      email,
      password,
    });
    if (error) {
      if (error?.code === 'user_already_exists') {
        dev('User already exists. Logging in instead.');
        const user = await this.login(email, password);
      } else {
        throw new Error(
          'api/auth > User registration failed: ' +
            JSON.stringify(error, null, 2),
        );
      }
    }

    if (!data?.session?.access_token) {
      throw new Error(
        'api/auth > Invalid access token: ' + JSON.stringify(data, null, 2),
      );
    }

    dev(
      'Storing token from registration action in secure storage:',
      data.session?.access_token,
    );
    await this.secureStorage.set(data.session?.access_token);

    return data.user;
  }

  /**
   * Log the user in with the external auth provider service and store the token in local secure storage.
   * @returns The user data from the external auth provider service.
   */
  public async login(
    email: string,
    password: string,
  ): Promise<SupabaseAuthUser | null> {
    const { data, error } = await this.authClient.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (error.name === 'AuthApiError') {
        dev('api/auth > Error logging in:', JSON.stringify(error, null, 2));
        throw new Error(
          'Incorrect credentials' + JSON.stringify(error, null, 2),
        );
      }
      dev('api/auth > Error logging in: ' + JSON.stringify(error, null, 2));
      throw new Error('Invalid user' + JSON.stringify(error, null, 2));
    }
    if (!data?.session?.access_token) {
      throw new Error('Invalid token' + JSON.stringify(data, null, 2));
    }

    dev(
      'Storing token from login action in secure storage:',
      data.session?.access_token,
    );
    await this.secureStorage.set(data.session?.access_token);

    return data.user;
  }

  /**
   * Log the user out of the external auth provider service and remove the token from local secure storage.
   */
  public async logout(): Promise<void> {
    dev('Logging out');
    const { error } = await this.authClient.signOut();

    if (error) {
      throw new Error('Error logging out' + JSON.stringify(error, null, 2));
    }

    dev('Removing token from secure storage');
    await this.secureStorage.remove();
  }
}

export default new AuthService();
