import { createMMKV } from "react-native-mmkv";
import type { StateStorage } from "zustand/middleware";

export const createMmkvStorage = (id: string): StateStorage => {
  const storage = createMMKV({ id });

  return {
    getItem: (name: string) => storage.getString(name) ?? null,
    setItem: (name: string, value: string) => storage.set(name, value),
    removeItem: (name: string) => storage.remove(name),
  };
};
