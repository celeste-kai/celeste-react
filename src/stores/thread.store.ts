import { create } from "zustand";
import type { Thread } from "../domain/entities/Thread";

interface ThreadState {
  thread: Thread | null;
  conversationId: string | null;
  setThread: (thread: Thread) => void;
  setConversationId: (id: string | null) => void;
  clear: () => void;
}

export const useThreadStore = create<ThreadState>((set) => ({
  thread: null,
  conversationId: null,

  setThread: (thread) => set({ thread }),
  setConversationId: (id) => set({ conversationId: id }),
  clear: () => set({ thread: null, conversationId: null })
}));
