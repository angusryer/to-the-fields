declare module 'react-native-config' {
  interface Env {
    ENV: 'development' | 'production' | 'staging';
    API_PORT: string;
    API_URL: string;
    LOCALHOST_ANDROID: string;
    LOCALHOST_IOS: string;
    API_URL_ANDROID: string;
    API_URL_IOS: string;
    SUPABASE_PORT: string;
    SUPABASE_URL: string;
    SUPABASE_ANDROID_URL: string;
    SUPABASE_IOS_URL: string;
    SUPABASE_ANDROID_AUTH_URL: string;
    SUPABASE_IOS_AUTH_URL: string;
    SUPABASE_ANON_KEY: string;
  }

  const BuildConfig: Env;

  export default BuildConfig;
}
