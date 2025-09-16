import { create } from "zustand";
import type { Conversation } from "../domain/entities/Conversation";
import { repository } from "../infrastructure/repository";

interface ConversationState {
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  refresh: () => Promise<Conversation[]>;
}

export const useConversationStore = create<ConversationState>((set) => ({
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
  refresh: async () => {
    const conversations = await repository.loadConversations();
    set({ conversations });
    return conversations;
  },
}));
