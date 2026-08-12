import { createMMKV } from "react-native-mmkv";
import type { StateStorage } from "zustand/middleware";

/**
 * Builds a Zustand-compatible Storage adapter backed by an MMKV instance.
 * Shared by the cart and favourites stores to avoid duplicating the
 * getItem/setItem/removeItem boilerplate.
 */
export const createMmkvStorage = (id: string): StateStorage => {
  const storage = createMMKV({ id });

  return {
    getItem: (name: string) => storage.getString(name) ?? null,
    setItem: (name: string, value: string) => storage.set(name, value),
    removeItem: (name: string) => storage.remove(name),
  };
};
