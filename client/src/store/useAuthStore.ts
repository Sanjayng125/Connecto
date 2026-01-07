import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";
import { decryptData, encryptData } from "../utils";

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
            storage:
                typeof window !== "undefined"
                    ? {
                        getItem: (key) => {
                            try {
                                const encryptedData = localStorage.getItem(key);

                                if (!encryptedData) return null;

                                const decrypted = decryptData(encryptedData);

                                if (!decrypted) {
                                    localStorage.removeItem(key);
                                    return null;
                                }

                                return decrypted;
                            } catch (err) {
                                console.error("Failed to get item from localStorage", err);
                                localStorage.removeItem(key);
                                return null;
                            }
                        },
                        setItem: (key, value) => {
                            try {
                                const encryptedData = encryptData(value);
                                if (encryptedData) {
                                    localStorage.setItem(key, encryptedData);
                                } else {
                                    console.error(
                                        "Failed to encrypt data, not saving to localStorage"
                                    );
                                }
                            } catch (err) {
                                console.error("Error while saving to localStorage", err);
                            }
                        },
                        removeItem: (key) => localStorage.removeItem(key),
                    }
                    : undefined,
        }
    )
);
