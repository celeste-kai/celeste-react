import { create } from "zustand";
import type { ModelOut } from "../types/api";
import type { ImageMode } from "../lib/capability";

export type CapabilityId = "text" | "image" | "video" | "audio";

export interface SelectionsState {
  capability: CapabilityId;
  provider: string | null;
  model: string | null;
  providerFilter: string | null;
  imageMode: ImageMode;
  setCapability: (cap: CapabilityId) => void;
  setProvider: (prov: string | null) => void;
  setModel: (model: string | null) => void;
  setProviderFilter: (prov: string | null) => void;
  setImageMode: (mode: ImageMode) => void;
  selectModelFromCatalog: (model: ModelOut) => void;
}

export const useSelectionsStore = create<SelectionsState>((set) => ({
  capability: "text" as CapabilityId,
  provider: null,
  model: null,
  providerFilter: null,
  imageMode: "generate" as ImageMode,
  setCapability: (capability) => set({ capability }),
  setProvider: (provider) => set({ provider }),
  setModel: (model) => set({ model }),
  setProviderFilter: (providerFilter) => set({ providerFilter }),
  setImageMode: (imageMode) => set({ imageMode }),
  selectModelFromCatalog: (modelObj) =>
    set({ model: modelObj.id, provider: modelObj.provider }),
}));
