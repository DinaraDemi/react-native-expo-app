import { Book } from "@/types/interfaces";
import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const storage = createMMKV({ id: "favourites-storage" });

const mmkvStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.remove(name);
  },
};

interface FavouritesState {
  favourites: Book[];
  isFavourite: (key: string) => boolean;
  addFavourite: (book: Book) => void;
  removeFavourite: (key: string) => void;
  toggleFavourite: (book: Book) => void;
}

export const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set, get) => ({
      favourites: [],
      isFavourite: (key) => get().favourites.some((b) => b.key === key),
      addFavourite: (book) => {
        if (get().isFavourite(book.key)) return;
        set((state) => ({ favourites: [...state.favourites, book] }));
      },
      removeFavourite: (key) => {
        set((state) => ({
          favourites: state.favourites.filter((b) => b.key !== key),
        }));
      },
      toggleFavourite: (book) => {
        if (get().isFavourite(book.key)) {
          get().removeFavourite(book.key);
        } else {
          get().addFavourite(book);
        }
      },
    }),
    {
      name: "favourites-storage",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);