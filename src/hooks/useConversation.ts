import { useState, useEffect, useCallback } from "react";
import { repository } from "../infrastructure/repository";
import { Conversation } from "../domain/entities/Conversation";
import { useThreadStore } from "../stores/thread.store";

export function useConversation() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { conversationId, setConversationId } = useThreadStore();

  const loadConversations = useCallback(async () => {
    const loaded = await repository.loadConversations();
    setConversations(loaded);
  }, []);

  const createConversation = useCallback(
    async (title: string) => {
      const conversation = Conversation.create(title);
      await repository.saveConversation(conversation);
      setConversationId(conversation.getId());
      await loadConversations();
      return conversation;
    },
    [loadConversations, setConversationId]
  );

  const deleteConversation = useCallback(
    async (id: string) => {
      await repository.deleteConversation(id);
      const { conversationId: currentConversationId } = useThreadStore.getState();
      if (currentConversationId === id) {
        setConversationId(null);
      }
      await loadConversations();
    },
    [loadConversations, setConversationId]
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
