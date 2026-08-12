import { Book } from "@/types/interfaces";
import { createMmkvStorage } from "@/utils/mmkvStorage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const storage = createMmkvStorage("cart-storage");

export interface CartItem {
  book: Book;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (book) => {
        const existing = get().items.find((i) => i.book.key === book.key);
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.book.key === book.key ? { ...i, quantity: i.quantity + 1 } : i
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { book, quantity: 1 }],
          }));
        }
      },
      removeFromCart: (key) => {
        set((state) => ({
          items: state.items.filter((i) => i.book.key !== key),
        }));
      },
      updateQuantity: (key, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(key);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.book.key === key ? { ...i, quantity } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => storage),
    }
  )
);

export const useCartTotalQuantity = () =>
  useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));