import { create } from 'zustand';
import type { ModelOut } from '../../types/api';

export type CapabilityId = 'text' | 'image' | 'video';

export interface SelectionsState {
  capability: CapabilityId;
  provider: string | null;
  model: string | null;
  streaming: boolean;
  setCapability: (cap: CapabilityId) => void;
  setProvider: (prov: string | null) => void;
  setModel: (model: string | null) => void;
  setStreaming: (enabled: boolean) => void;
  selectModelFromCatalog: (model: ModelOut) => void;
}

const STORAGE_KEY = 'celeste_selections_v1';

function loadInitial(): Pick<SelectionsState, 'capability' | 'provider' | 'model' | 'streaming'> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { capability: 'text', provider: null, model: null, streaming: true };
    }
    const parsed = JSON.parse(raw);
    return {
      capability: parsed.capability ?? 'text',
      provider: parsed.provider ?? null,
      model: parsed.model ?? null,
      streaming: parsed.streaming ?? true,
    };
  } catch {
    return { capability: 'text', provider: null, model: null, streaming: true };
  }
}

export const useSelectionsStore = create<SelectionsState>((set, get) => ({
  ...loadInitial(),
  setCapability: (cap) => {
    set({ capability: cap });
    const { provider, model, streaming } = get();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ capability: cap, provider, model, streaming }),
    );
  },
  setProvider: (prov) => {
    set({ provider: prov });
    const { capability, model, streaming } = get();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ capability, provider: prov, model, streaming }),
    );
  },
  setModel: (model) => {
    set({ model });
    const { capability, provider, streaming } = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ capability, provider, model, streaming }));
  },
  setStreaming: (enabled) => {
    set({ streaming: enabled });
    const { capability, provider, model } = get();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ capability, provider, model, streaming: enabled }),
    );
  },
  selectModelFromCatalog: (modelObj) => {
    const { capability, provider, streaming } = get();
    const nextProvider = provider ?? modelObj.provider;
    set({ model: modelObj.id, provider: nextProvider });
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ capability, provider: nextProvider, model: modelObj.id, streaming }),
    );
  },
}));
