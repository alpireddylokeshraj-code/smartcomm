"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  name: string;
  email: string;
  role: string;
  team: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email?: string) => void;
  logout: () => void;
}

const defaultUser: User = {
  name: "Lokesh Raj",
  email: "alpireddylokesh.raj@cognizant.com",
  role: "Platform Administrator",
  team: "AI Operations",
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email) =>
        set({
          isAuthenticated: true,
          user: email
            ? { ...defaultUser, email }
            : defaultUser,
        }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    { name: "smartcomm-auth" }
  )
);
