import { create } from 'zustand';
import { generateId } from '../../lib/id';
import type { CapabilityId } from '../../lib/store/selections';
import type {
  ContentPart,
  ImagePart,
  Role,
  TextPart,
  ThreadItem,
  ThreadItemInput,
  VideoPart,
} from '../../domain/thread';

export interface ThreadState {
  items: ThreadItem[];
  addItem: (item: ThreadItemInput) => void;
  addText: (
    content: string,
    params: { role: Role; capability: CapabilityId; provider: string; model: string },
  ) => void;
  addImages: (
    images: Array<Omit<ImagePart, 'kind'>>,
    params: { role: Role; capability: CapabilityId; provider: string; model: string },
  ) => void;
  addVideos: (
    videos: Array<Omit<VideoPart, 'kind'>>,
    params: { role: Role; capability: CapabilityId; provider: string; model: string },
  ) => void;
  clear: () => void;
}

export const useThreadStore = create<ThreadState>((set) => ({
  items: [],
  addItem: (item) => {
    const now = Date.now();
    const finalItem: ThreadItem = {
      id: item.id || generateId(),
      createdAt: item.createdAt || now,
      ...item,
    } as ThreadItem;
    set((state) => ({ items: [...state.items, finalItem] }));
  },
  addText: (content, params) => {
    const part: TextPart = { kind: 'text', content };
    set((state) => ({
      items: [
        ...state.items,
        {
          id: generateId(),
          createdAt: Date.now(),
          parts: [part as ContentPart],
          role: params.role,
          capability: params.capability,
          provider: params.provider,
          model: params.model,
        },
      ],
    }));
  },
  addImages: (images, params) => {
    const parts: ImagePart[] = images.map((img) => ({ kind: 'image', ...img }));
    set((state) => ({
      items: [
        ...state.items,
        {
          id: generateId(),
          createdAt: Date.now(),
          parts,
          role: params.role,
          capability: params.capability,
          provider: params.provider,
          model: params.model,
        },
      ],
    }));
  },
  addVideos: (videos, params) => {
    const parts: VideoPart[] = videos.map((v) => ({ kind: 'video', ...v }));
    set((state) => ({
      items: [
        ...state.items,
        {
          id: generateId(),
          createdAt: Date.now(),
          parts,
          role: params.role,
          capability: params.capability,
          provider: params.provider,
          model: params.model,
        },
      ],
    }));
  },
  clear: () => set({ items: [] }),
}));
