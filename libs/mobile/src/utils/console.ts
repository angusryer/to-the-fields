import { Platform } from 'react-native';
import Config from 'react-native-config';

// Standard colors (supported in most terminals)
// Foreground colors
const BLUE = '\x1b[34m'; // Blue
const GREEN = '\x1b[32m'; // Green
const MAGENTA = '\x1b[35m'; // Magenta
const CYAN = '\x1b[36m'; // Cyan
const RED = '\x1b[31m'; // Red
const YELLOW = '\x1b[33m'; // Yellow
const LIGHT_GREEN = '\x1b[92m'; // Light Green
const LIGHT_YELLOW = '\x1b[93m'; // Light Yellow
const LIGHT_BLUE = '\x1b[94m'; // Light Blue
const LIGHT_MAGENTA = '\x1b[95m'; // Light Magenta
const LIGHT_CYAN = '\x1b[96m'; // Light Cyan

// Reset
const RESET = '\x1b[0m'; // Reset to default color

/**
 * Convience flag used for globally toggling debug outputs throughout
 * the app where ever AppError option's _debug flag is set, or when
 * the dev() function below is used.
 */
export const _debug =
  __DEV__ && !(Config.ENV === 'production' || Config.ENV === 'staging');

/**
 * Environment-aware console.log for development purposes. Differentiates between
 * iOS and Android console logs.
 * @param message this message will be printed to the console in a color coded format
 * @param args any additional arguments to be printed to the console in a regular format
 */
export const dev = (message?: any, ...args: any[]): void => {
  const isIos = Platform.OS === 'ios';
  if (
    _debug &&
    process.env.ENVIRONMENT !== 'test' &&
    process.env.NODE_ENV !== 'test'
  ) {
    console.log(
      `${
        isIos ? GREEN + 'iOS____:' : MAGENTA + 'Android:'
      } ${BLUE}${message}${RESET}`,
      ...args,
    );
  }
};

export const limit = (value: any, chars: number = 100) => {
  // Custom replacer function to handle circular references
  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (_key: string, value: any) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

  let _value = JSON.stringify(value, getCircularReplacer());

  if (_value.length > chars) {
    return _value.slice(0, chars) + '...';
  } else {
    return _value;
  }
};

export const netdev = (
  method?: any,
  status?: any,
  url?: any,
  params?: any,
  time?: any,
  etag?: any,
  ...args: any[]
): void => {
  const isIos = Platform.OS === 'ios';
  if (
    _debug &&
    process.env.ENVIRONMENT !== 'test' &&
    process.env.NODE_ENV !== 'test'
  ) {
    const _method = String(method?.toUpperCase() ?? 'N/A').padEnd(7, ' ');
    const _status = !isNaN(Number(status)) ? Number(status) : 999;
    status = String(_status).padEnd(4, ' ');
    const _url = String(url ?? 'No URL!');
    const _time = !isNaN(Number(time)) ? Number(time) : 0;

    let methodColor;
    if (_method.startsWith('GET')) {
      methodColor = CYAN;
    } else if (_method.startsWith('POST')) {
      methodColor = LIGHT_YELLOW;
    } else if (_method.startsWith('PUT')) {
      methodColor = YELLOW;
    } else if (_method.startsWith('DELETE')) {
      methodColor = RED;
    } else {
      methodColor = LIGHT_BLUE;
    }

    let statusColor;
    if (status === 204) {
      statusColor = LIGHT_GREEN;
    } else if (_status >= 200 && _status < 300) {
      statusColor = GREEN;
    } else if (_status >= 400) {
      statusColor = RED;
    } else {
      statusColor = YELLOW;
    }

    let timeColor;
    if (time > 1000) {
      timeColor = RED;
    } else if (time > 500) {
      timeColor = YELLOW;
    } else {
      timeColor = GREEN;
    }

    let fullURL;
    if (params) {
      const queryString = Object.keys(params)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
        )
        .join('&');

      fullURL = `${LIGHT_CYAN}${_url}${LIGHT_YELLOW}?${queryString}`;
    } else {
      fullURL = `${LIGHT_CYAN}${_url}`;
    }

    console.log(
      `${
        isIos ? GREEN + 'iOS____:' : MAGENTA + 'Android:'
      } ${methodColor}${_method}${statusColor}${status} ${timeColor}${(
        _time + 'ms'
      ).padEnd(7, ' ')}${RESET} ${LIGHT_MAGENTA}${(etag
        ? '(' + etag + ')'
        : ''
      ).padEnd(40, ' ')} ${fullURL}${RESET}`,
      ...args,
    );
  }
};
