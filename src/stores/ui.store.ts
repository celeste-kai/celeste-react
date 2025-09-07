import { create } from "zustand";

interface UIState {
  openMenu: "provider" | "model" | null;
  imageMode: "generate" | "edit";
  isLoading: boolean;

  setOpenMenu: (menu: "provider" | "model" | null) => void;
  setImageMode: (mode: "generate" | "edit") => void;
  setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  openMenu: null,
  imageMode: "generate",
  isLoading: false,

  setOpenMenu: (menu) => set({ openMenu: menu }),
  setImageMode: (mode) => set({ imageMode: mode }),
  setLoading: (loading) => set({ isLoading: loading })
}));
