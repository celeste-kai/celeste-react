import { useState, useEffect, useCallback } from "react";
import { repository } from "../infrastructure/repository";
import { Conversation } from "../domain/entities/Conversation";
import { useThreadStore } from "../stores/thread.store";

type LoadConversationsHandler = () => Promise<void>;

let loadConversationsHandler: LoadConversationsHandler | null = null;

export const loadConversations = async () => {
  if (loadConversationsHandler) {
    await loadConversationsHandler();
  }
};

export function useConversation() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { conversationId, setConversationId } = useThreadStore();

  const loadConversationsCallback = useCallback(async () => {
    const loaded = await repository.loadConversations();
    setConversations(loaded);
  }, []);

  const createConversation = useCallback(
    async (title: string) => {
      const conversation = Conversation.create(title);
      await repository.saveConversation(conversation);
      setConversationId(conversation.getId());
      await loadConversationsCallback();
      return conversation;
    },
    [loadConversationsCallback, setConversationId]
  );

  const deleteConversation = useCallback(
    async (id: string) => {
      await repository.deleteConversation(id);
      const { conversationId: currentConversationId } = useThreadStore.getState();
      if (currentConversationId === id) {
        setConversationId(null);
      }
      await loadConversationsCallback();
    },
    [loadConversationsCallback, setConversationId]
  );

  useEffect(() => {
    loadConversationsHandler = loadConversationsCallback;
    loadConversationsCallback();

    return () => {
      if (loadConversationsHandler === loadConversationsCallback) {
        loadConversationsHandler = null;
      }
    };
  }, [loadConversationsCallback]);

  return {
    conversations,
    conversationId,
    createConversation,
    deleteConversation,
    loadConversations: loadConversationsCallback
  };
}
