declare module 'react-native-mmkv' {
  export interface MMKVConfiguration {
    id: string;
    path?: string;
    encryptionKey?: string;
  }

  export class MMKV {
    constructor(config?: MMKVConfiguration);
    set(key: string, value: boolean | string | number | Uint8Array): void;
    getString(key: string): string | undefined;
    getNumber(key: string): number | undefined;
    getBoolean(key: string): boolean | undefined;
    getBuffer(key: string): Uint8Array | undefined;
    contains(key: string): boolean;
    delete(key: string): void;
    clearAll(): void;
    getAllKeys(): string[];
    recrypt(key: string): void;
  }
}