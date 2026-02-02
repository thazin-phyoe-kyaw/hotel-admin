"use client";
import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;       // Desktop collapse / expand
  isMobileOpen: boolean; // Mobile drawer
  toggle: () => void;
  openMobile: () => void;
  closeMobile: () => void;
}

export const useSidebar = create<SidebarState>((set) => ({
  isOpen: true,
  isMobileOpen: false,

  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  openMobile: () => set({ isMobileOpen: true }),
  closeMobile: () => set({ isMobileOpen: false }),
}));
