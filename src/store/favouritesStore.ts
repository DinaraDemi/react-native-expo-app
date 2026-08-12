import { Book } from "@/types/interfaces";
import { createMmkvStorage } from "@/utils/mmkvStorage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const storage = createMmkvStorage("favourites-storage");

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
      storage: createJSONStorage(() => storage),
    }
  )
);