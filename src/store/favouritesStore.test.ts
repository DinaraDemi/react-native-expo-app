import { useFavouritesStore } from "@/store/favouritesStore";
import type { Book } from "@/types/interfaces";

jest.mock("@/utils/mmkvStorage", () => {
  const stores = new Map<string, Map<string, string>>();
  return {
    createMmkvStorage: (id: string) => {
      if (!stores.has(id)) stores.set(id, new Map());
      const map = stores.get(id)!;
      return {
        getItem: (name: string) => map.get(name) ?? null,
        setItem: (name: string, value: string) => {
          map.set(name, value);
        },
        removeItem: (name: string) => {
          map.delete(name);
        },
      };
    },
  };
});

const book = (key: string): Book => ({ key, title: key });

describe("useFavouritesStore", () => {
  beforeEach(() => {
    useFavouritesStore.setState({ favourites: [] });
  });

  it("adds a favourite", () => {
    useFavouritesStore.getState().addFavourite(book("/works/OL1W"));
    expect(useFavouritesStore.getState().isFavourite("/works/OL1W")).toBe(true);
  });

  it("does not add a duplicate favourite", () => {
    const { addFavourite } = useFavouritesStore.getState();
    addFavourite(book("/works/OL1W"));
    addFavourite(book("/works/OL1W"));
    expect(useFavouritesStore.getState().favourites).toHaveLength(1);
  });

  it("removes a favourite by key", () => {
    const { addFavourite, removeFavourite } = useFavouritesStore.getState();
    addFavourite(book("/works/OL1W"));
    addFavourite(book("/works/OL2W"));
    removeFavourite("/works/OL1W");
    expect(useFavouritesStore.getState().favourites.map((b) => b.key)).toEqual(["/works/OL2W"]);
  });

  it("toggleFavourite adds and then removes a favourite", () => {
    const { toggleFavourite } = useFavouritesStore.getState();
    toggleFavourite(book("/works/OL1W"));
    expect(useFavouritesStore.getState().isFavourite("/works/OL1W")).toBe(true);
    toggleFavourite(book("/works/OL1W"));
    expect(useFavouritesStore.getState().isFavourite("/works/OL1W")).toBe(false);
  });
});
