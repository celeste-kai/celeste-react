import { create } from "zustand";

export type DropdownId = "provider" | "model" | null;

interface UiState {
  openMenu: DropdownId;
  setOpenMenu: (id: DropdownId) => void;
}

export const useUiStore = create<UiState>((set) => ({
  openMenu: null,
  setOpenMenu: (id) => set({ openMenu: id }),
}));
