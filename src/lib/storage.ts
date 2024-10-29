/*  Storage related all method will resides here. */

import { MMKV } from 'react-native-mmkv';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

// Create and Initialized the MMKV instance
const storage = new MMKV();

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    storage.set(name, value);
  },
  getItem: name => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: name => {
    storage.delete(name);
  },
};

/* All Async Storage Key's will resides here */
enum STORAGE_KEYS {
  AUTH_TOKEN_KEY = 'authToken',
  TIME_STAMP_KEY = 'timeStamp',
  DEVICE_ID_KEY = 'deviceId',
  FCM_TOKEN_KEY = 'fcmToken'
}

export { createJSONStorage, persist, storage, STORAGE_KEYS, zustandStorage };
