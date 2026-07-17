"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { notifications as seedNotifications, type Notification } from "@/lib/mock-data";

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebar: (v: boolean) => void;
  commandOpen: boolean;
  setCommandOpen: (v: boolean) => void;
  copilotOpen: boolean;
  setCopilotOpen: (v: boolean) => void;
  notifications: Notification[];
  markAllRead: () => void;
  markRead: (id: string) => void;
}

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebar: (v) => set({ sidebarCollapsed: v }),
      commandOpen: false,
      setCommandOpen: (v) => set({ commandOpen: v }),
      copilotOpen: false,
      setCopilotOpen: (v) => set({ copilotOpen: v }),
      notifications: seedNotifications,
      markAllRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),
      markRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
    }),
    {
      name: "smartcomm-ui",
      partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }),
    }
  )
);
