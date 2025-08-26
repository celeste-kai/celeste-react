import { create } from "zustand";

interface ExecState {
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
}

export const useExecStore = create<ExecState>((set) => ({
  isGenerating: false,
  setIsGenerating: (v: boolean) => set({ isGenerating: v }),
}));
