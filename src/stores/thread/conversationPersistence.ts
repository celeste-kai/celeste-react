import { create } from "zustand";
import { conversationsService } from "../../services/conversations";
import { supabase } from "../../lib/supabase";
import {
  transformThreadItemsToMessages,
  transformMessagesToThreadItems,
} from "../../utils/conversationTransforms";
import type { ThreadItem } from "../../domain/thread";

export interface ConversationPersistenceState {
  currentConversationId: string | null;
  isSaving: boolean;

  // Persistence methods
  createNewConversation: (title?: string) => Promise<string>;
  loadConversation: (
    conversationId: string,
    setThreadItems: (items: ThreadItem[]) => void,
  ) => Promise<void>;
  loadMostRecentConversation: (
    setThreadItems: (items: ThreadItem[]) => void,
  ) => Promise<void>;
  saveCurrentConversation: (threadItems: ThreadItem[]) => Promise<void>;
  updateConversationTitle: (title: string) => Promise<void>;
  deleteCurrentConversation: () => Promise<void>;

  // State management
  setSaving: (saving: boolean) => void;
  setCurrentConversationId: (id: string | null) => void;
}

export const useConversationPersistence = create<ConversationPersistenceState>(
  (set, get) => ({
    currentConversationId: null,
    isSaving: false,

    createNewConversation: async (title?: string) => {
      const _state = get();
      try {
        set({ isSaving: true });

        // Create conversation with provided title or default
        const conversationTitle = title || "New Conversation";
        const conversation = await conversationsService.createConversation({
          title: conversationTitle,
        });

        // Set new conversation as current
        set({
          currentConversationId: conversation.id,
        });

        return conversation.id;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create conversation";
        throw new Error(errorMessage);
      } finally {
        set({ isSaving: false });
      }
    },

    loadConversation: async (
      conversationId: string,
      setThreadItems: (items: ThreadItem[]) => void,
    ) => {
      try {
        set({ isSaving: true });

        // Load messages
        const messages =
          await conversationsService.getConversationMessages(conversationId);
        const threadItems = transformMessagesToThreadItems(messages);

        set({
          currentConversationId: conversationId,
        });

        // Update thread items via callback
        setThreadItems(threadItems);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load conversation";
        throw new Error(errorMessage);
      } finally {
        set({ isSaving: false });
      }
    },

    loadMostRecentConversation: async (
      setThreadItems: (items: ThreadItem[]) => void,
    ) => {
      try {
        set({ isSaving: true });

        // Get the most recent conversation
        const conversations = await conversationsService.listConversations({
          limit: 1,
          order_by: "updated_at",
          order_direction: "desc",
        });

        if (conversations.length > 0) {
          const recentConversation = conversations[0];
          await get().loadConversation(recentConversation.id, setThreadItems);
        }
      } catch {
        // Warning: Failed to load most recent conversation
        // Don't throw error for initialization - just log warning
      } finally {
        set({ isSaving: false });
      }
    },

    saveCurrentConversation: async (threadItems: ThreadItem[]) => {
      const state = get();

      // Don't save empty conversations
      if (!threadItems || threadItems.length === 0) {
        return;
      }

      // Auto-create conversation if none exists (but only when we have content)
      let conversationId = state.currentConversationId;
      if (!conversationId) {
        try {
          const conversation = await conversationsService.createConversation({
            title: "New Conversation",
          });
          conversationId = conversation.id;
          // Update the current conversation ID without clearing items
          set({ currentConversationId: conversation.id });
        } catch {
          // Error: Failed to create conversation during save
          throw new Error("Failed to create conversation for saving");
        }
      }

      try {
        set({ isSaving: true });

        // Get current user from Supabase auth
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("User not authenticated");
        }

        const messageRequests = transformThreadItemsToMessages(
          threadItems,
          conversationId,
          user.id,
        );

        // Clear existing messages and add new ones
        // This is a simple approach - in production you might want to do incremental updates
        const existingMessages =
          await conversationsService.getConversationMessages(conversationId);

        // Delete existing messages
        for (const message of existingMessages) {
          await conversationsService.deleteMessage(message.id);
        }

        // Add new messages
        for (const messageRequest of messageRequests) {
          await conversationsService.createMessage(messageRequest);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to save conversation";
        throw new Error(errorMessage);
      } finally {
        set({ isSaving: false });
      }
    },

    updateConversationTitle: async (title: string) => {
      const state = get();
      if (!state.currentConversationId) {
        throw new Error("No current conversation to update");
      }

      try {
        await conversationsService.updateConversation(state.currentConversationId, {
          title,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to update conversation title";
        throw new Error(errorMessage);
      }
    },

    deleteCurrentConversation: async () => {
      const state = get();
      if (!state.currentConversationId) {
        throw new Error("No current conversation to delete");
      }

      try {
        set({ isSaving: true });

        await conversationsService.deleteConversation(state.currentConversationId);

        // Clear the current conversation
        set({
          currentConversationId: null,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete conversation";
        throw new Error(errorMessage);
      } finally {
        set({ isSaving: false });
      }
    },

    setSaving: (saving: boolean) => set({ isSaving: saving }),
    setCurrentConversationId: (id: string | null) => set({ currentConversationId: id }),
  }),
);
