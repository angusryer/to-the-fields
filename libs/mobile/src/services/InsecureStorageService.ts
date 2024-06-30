import { MMKV } from 'react-native-mmkv';

export default class Storage {
  private client: MMKV;

  constructor(userId: string) {
    this.client = new MMKV({ id: userId });
  }

  public set(key: string, value: any): void {
    this.client.set(key, JSON.stringify(value));
  }

  public get<T = any>(key: string): T | null {
    const val = this.client.getString(key);
    if (!val) return null;
    return JSON.parse(val);
  }

  public remove(key: string): void {
    this.client.delete(key);
  }

  public clear(): void {
    this.client.clearAll();
  }
}
