import AppRoot from './AppRoot';
import { decode } from 'base-64';
import { AppRegistry } from 'react-native';

// "atob" function not available in the global scope in React Native for use with Supabase Auth, so we polyfill it here
global.atob = decode;

// Register the entry app component
AppRegistry.registerComponent('tothefields', () => AppRoot);
