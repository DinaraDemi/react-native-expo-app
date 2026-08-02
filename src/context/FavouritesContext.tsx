import { createContext, useContext, type ReactNode } from "react";
import { useFavourites } from "@/hooks/useFavourites";
import { Book } from "@/types/interfaces";

interface FavouritesContextValue {
  favourites: Book[];
  isFavourite: (key: string) => boolean;
  addFavourite: (book: Book) => void;
  removeFavourite: (key: string) => void;
  toggleFavourite: (book: Book) => void;
}

const FavouritesContext = createContext<FavouritesContextValue | null>(null);

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const value = useFavourites();
  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavouritesContext(): FavouritesContextValue {
  const ctx = useContext(FavouritesContext);
  if (!ctx) {
    throw new Error("useFavouritesContext must be used inside <FavouritesProvider>");
  }
  return ctx;
}
