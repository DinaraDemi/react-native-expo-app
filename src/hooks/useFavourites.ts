import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { Book } from "@/types/interfaces";

const STORAGE_KEY = "favourites";

export function useFavourites() {
  const [favourites, setFavourites] = useState<Book[]>([]);

  // Load from storage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setFavourites(JSON.parse(raw));
        } catch {
          // ignore parse errors
        }
      }
    });
  }, []);

  const persist = useCallback((books: Book[]) => {
    setFavourites(books);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }, []);

  const isFavourite = useCallback(
    (key: string) => favourites.some((b) => b.key === key),
    [favourites]
  );

  const addFavourite = useCallback(
    (book: Book) => {
      if (!isFavourite(book.key)) {
        persist([...favourites, book]);
      }
    },
    [favourites, isFavourite, persist]
  );

  const removeFavourite = useCallback(
    (key: string) => {
      persist(favourites.filter((b) => b.key !== key));
    },
    [favourites, persist]
  );

  const toggleFavourite = useCallback(
    (book: Book) => {
      if (isFavourite(book.key)) {
        removeFavourite(book.key);
      } else {
        addFavourite(book);
      }
    },
    [isFavourite, addFavourite, removeFavourite]
  );

  return { favourites, isFavourite, addFavourite, removeFavourite, toggleFavourite };
}
