import { useState, useEffect } from "react";
import { repository } from "../infrastructure/repository";
import { Conversation } from "../domain/entities/Conversation";
import { useThreadStore } from "../stores/thread.store";

export function useConversation() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { conversationId, setConversationId } = useThreadStore();

  const loadConversations = async () => {
    const loaded = await repository.loadConversations();
    setConversations(loaded);
  };

  const createConversation = async (title: string) => {
    const conversation = Conversation.create(title);
    await repository.saveConversation(conversation);
    setConversationId(conversation.getId());
    await loadConversations();
    return conversation;
  };

  const deleteConversation = async (id: string) => {
    await repository.deleteConversation(id);
    if (conversationId === id) {
      setConversationId("");
    }
    await loadConversations();
  };

  useEffect(() => {
    loadConversations();
  }, []);

  return {
    conversations,
    conversationId,
    createConversation,
    deleteConversation,
    loadConversations
  };
}
