import * as Keychain from 'react-native-keychain';

class SecureStorage {
  async set(token: string) {
    await Keychain.setGenericPassword('token', token);
  }

  async get() {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return credentials.password;
    } else {
      return null;
    }
  }

  async remove() {
    await Keychain.resetGenericPassword();
  }
}

export default new SecureStorage();
