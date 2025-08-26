import { create } from "zustand";
import type { ModelOut } from "../../types/api";
import type { ImageMode } from "../capability";

export type CapabilityId = "text" | "image" | "video";

export interface SelectionsState {
  capability: CapabilityId;
  provider: string | null;
  model: string | null;
  providerFilter: string | null;
  imageMode: ImageMode; // Track generate vs edit mode
  setCapability: (cap: CapabilityId) => void;
  setProvider: (prov: string | null) => void;
  setModel: (model: string | null) => void;
  setProviderFilter: (prov: string | null) => void;
  setImageMode: (mode: ImageMode) => void;
  selectModelFromCatalog: (model: ModelOut) => void;
}

const STORAGE_KEY = "celeste_selections_v3";

function loadInitial(): Pick<
  SelectionsState,
  "capability" | "provider" | "model" | "providerFilter" | "imageMode"
> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        capability: "text",
        provider: null,
        model: null,
        providerFilter: null,
        imageMode: "generate",
      };
    }
    const parsed = JSON.parse(raw);
    const initial = {
      capability: parsed.capability ?? "text",
      provider: parsed.provider ?? null,
      model: parsed.model ?? null,
      providerFilter: parsed.providerFilter ?? null,
      imageMode: parsed.imageMode ?? "generate",
    } as const;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch {
    return {
      capability: "text",
      provider: null,
      model: null,
      providerFilter: null,
      imageMode: "generate",
    };
  }
}

export const useSelectionsStore = create<SelectionsState>((set, get) => ({
  ...loadInitial(),
  setCapability: (cap) => {
    set({ capability: cap });
    const { provider, model, providerFilter, imageMode } = get();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ capability: cap, provider, model, providerFilter, imageMode }),
    );
  },
  setImageMode: (mode) => {
    set({ imageMode: mode });
    const { capability, provider, model, providerFilter } = get();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ capability, provider, model, providerFilter, imageMode: mode }),
    );
  },
  setProvider: (prov) => {
    set({ provider: prov });
    const { capability, model, providerFilter, imageMode } = get();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ capability, provider: prov, model, providerFilter, imageMode }),
    );
  },
  setModel: (model) => {
    set({ model });
    const { capability, provider, providerFilter, imageMode } = get();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ capability, provider, model, providerFilter, imageMode }),
    );
  },
  setProviderFilter: (prov) => {
    set({ providerFilter: prov });
    const { capability, provider, model, imageMode } = get();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ capability, provider, model, providerFilter: prov, imageMode }),
    );
  },
  selectModelFromCatalog: (modelObj) => {
    const { capability, providerFilter, imageMode } = get();
    // Unconditionally lock provider to the model's provider and set the model id
    set({ model: modelObj.id, provider: modelObj.provider });
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        capability,
        provider: modelObj.provider,
        model: modelObj.id,
        providerFilter,
        imageMode,
      }),
    );
  },
}));
