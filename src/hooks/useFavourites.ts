import { useFavouritesStore } from "@/store/favouritesStore";
import { useCallback } from "react";

export function useFavourites() {
  const favourites = useFavouritesStore((s) => s.favourites);
  const addFavourite = useFavouritesStore((s) => s.addFavourite);
  const removeFavourite = useFavouritesStore((s) => s.removeFavourite);
  const toggleFavourite = useFavouritesStore((s) => s.toggleFavourite);

  const isFavourite = useCallback(
    (key: string) => favourites.some((b) => b.key === key),
    [favourites]
  );

  return {
    favourites,
    isFavourite,
    addFavourite,
    removeFavourite,
    toggleFavourite,
  };
}
