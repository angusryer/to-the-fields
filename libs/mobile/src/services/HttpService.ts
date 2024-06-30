import Axios, { AxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import { IReply } from 'shared';
import { dev } from '../utils/console';

/**
 * Base HTTP class to handle all the calls to our custom API.
 * All of these requests should be authenticated via the `AuthProvider` interceptor.
 */
class HttpService {
  private _apiUrl: string | undefined = undefined;
  private _client: Axios.AxiosInstance | undefined = undefined;

  constructor() {
    const _apiUrl = __DEV__
      ? Platform.select({
          ios: Config.API_URL_IOS,
          android: Config.API_URL_ANDROID,
        })
      : Config.API_URL;

    if (!_apiUrl) {
      throw new Error(
        'API_URL environment variable is not available for ' + Platform.OS,
      );
    }

    this._apiUrl = _apiUrl;
    this._client = Axios.create({
      baseURL: _apiUrl,
    });
  }

  public get client() {
    if (!this._client) {
      throw new Error('HTTP client is not available');
    }
    return this._client;
  }

  public get apiUrl() {
    if (!this._apiUrl) {
      throw new Error('API_URL environment variable is not available');
    }
    return this._apiUrl;
  }

  public async get<R = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R | undefined> {
    const res = await this.client.get<never, IReply<R>>(url, config);
    dev('GET:', res);
    return res.data;
  }

  public async post<T = any, R = any>(
    url: string,
    data: T,
    config?: AxiosRequestConfig,
  ): Promise<R | undefined> {
    const res = await this.client.post<T, IReply<R>>(url, data, config);
    dev('POST:', res);
    return res.data;
  }

  public async put<T = any, R = any>(
    url: string,
    data: T,
    config?: AxiosRequestConfig,
  ): Promise<R | undefined> {
    const res = await this.client.put<T, IReply<R>>(url, data, config);
    dev('PUT:', res);
    return res.data;
  }

  public async delete<T = any, R = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R | undefined> {
    const res = await this.client.delete<T, IReply<R>>(url, config);
    dev('DELETE:', res);
    return res.data;
  }
}

export default new HttpService();
