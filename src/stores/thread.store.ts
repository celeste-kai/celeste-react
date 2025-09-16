import { create } from "zustand";
import type { Thread } from "../domain/entities/Thread";

interface ThreadState {
  thread: Thread | null;
  conversationId: string | null;
  setThread: (thread: Thread) => void;
  setConversationId: (id: string | null) => void;
  clear: () => void;
}

// Load persisted conversationId on initialization
const getPersistedConversationId = (): string | null => {
  const stored = localStorage.getItem("conversation-storage");
  if (stored) {
    const parsed = JSON.parse(stored);
    return parsed.conversationId || null;
  }
  return null;
};

export const useThreadStore = create<ThreadState>((set) => ({
  thread: null,
  conversationId: getPersistedConversationId(),

  setThread: (thread) => set({ thread }),

  setConversationId: (id) => {
    // Save to localStorage when conversationId changes
    if (id) {
      localStorage.setItem(
        "conversation-storage",
        JSON.stringify({ conversationId: id }),
      );
    } else {
      localStorage.removeItem("conversation-storage");
    }
    set({ conversationId: id });
  },

  clear: () => {
    localStorage.removeItem("conversation-storage");
    set({ thread: null, conversationId: null });
  },
}));
