import { useEffect, useCallback } from "react";
import { repository } from "../infrastructure/repository";
import { Conversation } from "../domain/entities/Conversation";
import { useThreadStore } from "../stores/thread.store";
import { useConversationStore } from "../stores/conversation.store";

export function useConversation() {
  const conversations = useConversationStore((state) => state.conversations);
  const refreshConversations = useConversationStore((state) => state.refresh);
  const { conversationId, setConversationId } = useThreadStore();

  const loadConversations = useCallback(() => refreshConversations(), [refreshConversations]);

  const createConversation = useCallback(
    async (title: string) => {
      const conversation = Conversation.create(title);
      await repository.saveConversation(conversation);
      setConversationId(conversation.getId());
      await refreshConversations();
      return conversation;
    },
    [refreshConversations, setConversationId]
  );

  const deleteConversation = useCallback(
    async (id: string) => {
      await repository.deleteConversation(id);
      const { conversationId: currentConversationId } = useThreadStore.getState();
      if (currentConversationId === id) {
        setConversationId(null);
      }
      await refreshConversations();
    },
    [refreshConversations, setConversationId]
  );

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    conversationId,
    createConversation,
    deleteConversation,
    loadConversations
  };
}
