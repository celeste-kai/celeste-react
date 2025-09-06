import { create } from "zustand";
import { conversationsService } from "../../services/conversations";
import type { ThreadItem, ContentPart, TextPart } from "../../domain/thread";
import type { CapabilityId } from "../selections";

const generateId = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

interface ThreadState {
  items: ThreadItem[];
  currentConversationId: string | null;
  isLoading: boolean;

  addItem: (item: Partial<ThreadItem>) => void;
  addAssistantDraft: (params: {
    capability: CapabilityId;
    provider: string;
    model: string;
  }) => string;
  appendTextToItem: (id: string, delta: string) => void;
  updateItem: (id: string, parts: ContentPart[]) => void;
  clear: () => void;

  loadConversation: (id: string) => Promise<void>;
  saveCurrentConversation: () => Promise<void>;
  setCurrentConversationId: (id: string | null) => void;
}

export const useThreadStore = create<ThreadState>((set, get) => ({
  items: [],
  currentConversationId: null,
  isLoading: false,

  addItem: (item) => {
    const finalItem = {
      id: item.id || generateId(),
      createdAt: item.createdAt || Date.now(),
      ...item,
    } as ThreadItem;
    set((state) => ({ items: [...state.items, finalItem] }));
  },

  addAssistantDraft: (params) => {
    const draft: ThreadItem = {
      id: generateId(),
      createdAt: Date.now(),
      parts: [{ kind: "text", content: "" }],
      role: "assistant",
      capability: params.capability,
      provider: params.provider,
      model: params.model,
    };
    set((state) => ({ items: [...state.items, draft] }));
    return draft.id;
  },

  appendTextToItem: (id, delta) => {
    set((state) => ({
      items: state.items.map((it) => {
        if (it.id !== id) return it;
        const parts = [...(it.parts || [])];
        const textIdx = parts.findIndex((p) => (p as ContentPart).kind === "text");
        if (textIdx >= 0) {
          const tp = parts[textIdx] as TextPart;
          parts[textIdx] = { ...tp, content: (tp.content || "") + (delta || "") };
        } else {
          parts.push({ kind: "text", content: delta || "" });
        }
        return { ...it, parts };
      }),
    }));
  },

  updateItem: (id, parts) => {
    set((state) => ({
      items: state.items.map((it) => (it.id === id ? { ...it, parts } : it)),
    }));
  },

  clear: () => set({ items: [], currentConversationId: null }),

  loadConversation: async (id) => {
    set({ isLoading: true });
    const messages = await conversationsService.getConversationMessages(id);
    const items =
      messages?.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        capability: msg.capability,
        provider: msg.provider,
        model: msg.model,
        parts: msg.content,
        createdAt: new Date(msg.created_at).getTime(),
      })) || [];
    set({ items, currentConversationId: id, isLoading: false });
  },

  saveCurrentConversation: async () => {
    const state = get();
    if (!state.items.length) return;

    let conversationId = state.currentConversationId;
    if (!conversationId) {
      const firstText = state.items
        .find((i) => i.role === "user")
        ?.parts?.find((p) => p.kind === "text");
      const title =
        firstText && "content" in firstText
          ? firstText.content.toString().slice(0, 50)
          : "New Chat";
      const conv = await conversationsService.createConversation({ title });
      if (!conv) return;
      conversationId = conv.id;
      set({ currentConversationId: conversationId });
    }

    // At this point, conversationId is guaranteed to be non-null
    if (!conversationId) return;

    const existing = await conversationsService.getConversationMessages(conversationId);
    for (const msg of existing || []) {
      await conversationsService.deleteMessage(msg.id);
    }

    for (let i = 0; i < state.items.length; i++) {
      const item = state.items[i];
      await conversationsService.createMessage({
        conversation_id: conversationId,
        role: item.role,
        capability: item.capability,
        provider: item.provider,
        model: item.model,
        content: item.parts,
        order_index: i,
        metadata: { original_id: item.id, created_at: item.createdAt },
      });
    }
  },

  setCurrentConversationId: (id) => set({ currentConversationId: id }),
}));
