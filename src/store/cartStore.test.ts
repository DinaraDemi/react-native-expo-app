import { useCartStore } from "@/store/cartStore";
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

describe("useCartStore", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("adds a new item with quantity 1", () => {
    useCartStore.getState().addToCart(book("/works/OL1W"));
    expect(useCartStore.getState().items).toEqual([{ book: book("/works/OL1W"), quantity: 1 }]);
  });

  it("increments the quantity of an existing item", () => {
    const { addToCart } = useCartStore.getState();
    addToCart(book("/works/OL1W"));
    addToCart(book("/works/OL1W"));
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it("keeps distinct books as separate items", () => {
    const { addToCart } = useCartStore.getState();
    addToCart(book("/works/OL1W"));
    addToCart(book("/works/OL2W"));
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it("updates the quantity of an item", () => {
    useCartStore.getState().addToCart(book("/works/OL1W"));
    useCartStore.getState().updateQuantity("/works/OL1W", 5);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it("removes an item when its quantity is set to zero or less", () => {
    useCartStore.getState().addToCart(book("/works/OL1W"));
    useCartStore.getState().updateQuantity("/works/OL1W", 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("removes an item by key", () => {
    useCartStore.getState().addToCart(book("/works/OL1W"));
    useCartStore.getState().removeFromCart("/works/OL1W");
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("clears the cart", () => {
    const { addToCart, clearCart } = useCartStore.getState();
    addToCart(book("/works/OL1W"));
    addToCart(book("/works/OL2W"));
    clearCart();
    expect(useCartStore.getState().items).toEqual([]);
  });

  it("sums quantities across items", () => {
    const { addToCart, updateQuantity } = useCartStore.getState();
    addToCart(book("/works/OL1W"));
    addToCart(book("/works/OL2W"));
    updateQuantity("/works/OL1W", 3);
    const total = useCartStore.getState().items.reduce((sum, item) => sum + item.quantity, 0);
    expect(total).toBe(4);
  });
});
