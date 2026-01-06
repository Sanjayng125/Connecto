import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";

interface AuthState {
    user: User | null;
    setUser: (user: User) => void;
    accessToken: string | null;
    setAccessToken: (token: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),

            accessToken: null,
            setAccessToken: (token) => set({ accessToken: token }),

            clearAuth: () => set({ user: null, accessToken: null }),
        }),
        {
            name: "connecto-auth",
        }
    )
);
