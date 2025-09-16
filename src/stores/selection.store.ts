import { create } from "zustand";
import type { Provider } from "../core/enums";
import { Capability } from "../core/enums";

interface SelectionState {
  capability: Capability;
  provider: Provider | null;
  model: string | null;
  providerFilter: Provider | null;

  setCapability: (capability: Capability) => void;
  setProvider: (provider: Provider) => void;
  setModel: (model: string) => void;
  setProviderFilter: (provider: Provider | null) => void;
  selectModel: (model: { id: string; provider: Provider }) => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  capability: Capability.TEXT_GENERATION,
  provider: null,
  model: null,
  providerFilter: null,

  setCapability: (capability) => set({ capability }),
  setProvider: (provider) => set({ provider }),
  setModel: (model) => set({ model }),
  setProviderFilter: (providerFilter) => set({ providerFilter }),

  selectModel: (model) =>
    set({
      model: model.id,
      provider: model.provider,
    }),
}));
