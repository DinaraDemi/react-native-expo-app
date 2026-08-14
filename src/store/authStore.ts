import { createMmkvStorage } from "@/utils/mmkvStorage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const storage = createMmkvStorage("auth-storage");

export interface AuthUser {
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email) => set({ user: { email }, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => storage),
    },
  ),
);
