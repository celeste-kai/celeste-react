import { create } from "zustand";
import { generateId } from "../../utils";
import type { CapabilityId } from "../../lib/store/selections";
import type {
  ContentPart,
  ImagePart,
  Role,
  TextPart,
  ThreadItem,
  ThreadItemInput,
  VideoPart,
} from "../../domain/thread";
import { conversationsService } from "../../services/conversations";
import { conversationRealtimeService } from "../../services/conversationRealtimeService";
import { supabase } from "../../lib/supabase";
import {
  transformThreadItemsToMessages,
  transformMessagesToThreadItems,
} from "../../utils/conversationTransforms";

export interface ThreadState {
  items: ThreadItem[];
  currentConversationId: string | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Existing methods
  addItem: (item: ThreadItemInput) => void;
  addText: (
    content: string,
    params: { role: Role; capability: CapabilityId; provider: string; model: string },
  ) => void;
  addImages: (
    images: Array<Omit<ImagePart, "kind">>,
    params: { role: Role; capability: CapabilityId; provider: string; model: string },
  ) => void;
  addVideos: (
    videos: Array<Omit<VideoPart, "kind">>,
    params: { role: Role; capability: CapabilityId; provider: string; model: string },
  ) => void;
  addAssistantDraft: (params: {
    capability: CapabilityId;
    provider: string;
    model: string;
  }) => string;
  appendTextToItem: (id: string, delta: string) => void;
  clear: () => void;

  // New persistence methods
  createNewConversation: (title?: string) => Promise<string>;
  loadConversation: (conversationId: string) => Promise<void>;
  loadMostRecentConversation: () => Promise<void>;
  saveCurrentConversation: () => Promise<void>;
  updateConversationTitle: (title: string) => Promise<void>;
  deleteCurrentConversation: () => Promise<void>;

  // Real-time methods
  subscribeToCurrentConversation: () => () => void;
  unsubscribeFromRealtime: () => void;

  // Utility methods
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
}

let realtimeUnsubscribe: (() => void) | null = null;

export const useThreadStore = create<ThreadState>((set, get) => ({
  items: [],
  currentConversationId: null,
  isLoading: false,
  isSaving: false,
  error: null,
  addItem: (item) => {
    const now = Date.now();
    const finalItem: ThreadItem = {
      id: item.id || generateId(),
      createdAt: item.createdAt || now,
      ...item,
    } as ThreadItem;

    set((state: any) => ({ items: [...state.items, finalItem] }));
  },
  addText: (content, params) => {
    const part: TextPart = { kind: "text", content };
    set((state: any) => ({
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
    const parts: ImagePart[] = images.map((img) => ({ kind: "image", ...img }));
    set((state: any) => ({
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
    const parts: VideoPart[] = videos.map((v) => ({ kind: "video", ...v }));
    set((state: any) => ({
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
  addAssistantDraft: (params) => {
    const id = generateId();
    const now = Date.now();
    const draft: ThreadItem = {
      id,
      createdAt: now,
      role: "assistant",
      capability: params.capability,
      provider: params.provider,
      model: params.model,
      parts: [{ kind: "text", content: "" }],
    };
    set((state: any) => ({ items: [...state.items, draft] }));
    return id;
  },
  appendTextToItem: (id, delta) => {
    set((state: any) => ({
      items: state.items.map((it: any) => {
        if (it.id !== id) {
          return it;
        }
        const parts = it.parts ? [...it.parts] : [];
        const idx = parts.findIndex((p) => (p as ContentPart).kind === "text");
        if (idx >= 0) {
          const tp = parts[idx] as TextPart;
          parts[idx] = {
            ...tp,
            content: String(tp.content || "") + String(delta || ""),
          };
        } else {
          parts.push({ kind: "text", content: String(delta || "") });
        }
        return { ...it, parts } as ThreadItem;
      }),
    }));
  },
  clear: () => {
    // Unsubscribe from real-time updates when clearing
    if (realtimeUnsubscribe) {
      realtimeUnsubscribe();
      realtimeUnsubscribe = null;
    }
    set({
      items: [],
      currentConversationId: null,
      error: null,
    });
  },

  // New persistence methods
  createNewConversation: async (title?: string) => {
    const state = get();
    try {
      set({ isLoading: true, error: null });

      // Save current conversation if it exists and has items
      if (state.currentConversationId && state.items.length > 0) {
        try {
          await get().saveCurrentConversation();
        } catch {
          // Warning: Failed to save current conversation before creating new one
        }
      }

      // Create conversation with provided title or default
      const conversationTitle = title || "New Conversation";
      const conversation = await conversationsService.createConversation({
        title: conversationTitle,
      });

      // Clear current items and set new conversation as current
      set({
        currentConversationId: conversation.id,
        items: [], // Clear items for fresh start
      });

      return conversation.id;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create conversation";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  loadConversation: async (conversationId: string) => {
    try {
      set({ isLoading: true, error: null });

      // Unsubscribe from previous conversation
      if (realtimeUnsubscribe) {
        realtimeUnsubscribe();
        realtimeUnsubscribe = null;
      }

      // Load messages
      const messages =
        await conversationsService.getConversationMessages(conversationId);
      const threadItems = transformMessagesToThreadItems(messages);

      set({
        items: threadItems,
        currentConversationId: conversationId,
      });

      // Subscribe to real-time updates
      get().subscribeToCurrentConversation();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load conversation";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  loadMostRecentConversation: async () => {
    try {
      set({ isLoading: true, error: null });

      // Get the most recent conversation
      const conversations = await conversationsService.listConversations({
        limit: 1,
        order_by: "updated_at",
        order_direction: "desc",
      });

      if (conversations.length > 0) {
        const recentConversation = conversations[0];
        await get().loadConversation(recentConversation.id);
      }
    } catch {
      // Warning: Failed to load most recent conversation
      // Don't throw error for initialization - just log warning
    } finally {
      set({ isLoading: false });
    }
  },

  saveCurrentConversation: async () => {
    const state = get();

    // Don't save empty conversations
    if (!state.items || state.items.length === 0) {
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
      set({ isSaving: true, error: null });

      // Get current user from Supabase auth
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const messageRequests = transformThreadItemsToMessages(
        state.items,
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
      set({ error: errorMessage });
      throw error;
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
      set({ error: null });
      await conversationsService.updateConversation(state.currentConversationId, {
        title,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update conversation title";
      set({ error: errorMessage });
      throw error;
    }
  },

  deleteCurrentConversation: async () => {
    const state = get();
    if (!state.currentConversationId) {
      throw new Error("No current conversation to delete");
    }

    try {
      set({ isLoading: true, error: null });

      // Unsubscribe from real-time updates
      if (realtimeUnsubscribe) {
        realtimeUnsubscribe();
        realtimeUnsubscribe = null;
      }

      await conversationsService.deleteConversation(state.currentConversationId);

      // Clear the current conversation
      set({
        items: [],
        currentConversationId: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete conversation";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Real-time methods
  subscribeToCurrentConversation: () => {
    const state = get();
    if (!state.currentConversationId) {
      return () => {};
    }

    // Unsubscribe from previous subscription
    if (realtimeUnsubscribe) {
      realtimeUnsubscribe();
    }

    realtimeUnsubscribe = conversationRealtimeService.subscribeToConversation(
      state.currentConversationId,
      {
        onMessageChange: (event) => {
          if (event.eventType === "INSERT" && event.new) {
            // Add new message to thread
            const threadItem = transformMessagesToThreadItems([event.new])[0];
            if (threadItem) {
              set((state: any) => ({
                items: [...state.items, threadItem],
              }));
            }
          } else if (event.eventType === "UPDATE" && event.new) {
            // Update existing message
            const threadItem = transformMessagesToThreadItems([event.new])[0];
            if (threadItem) {
              set((state: any) => ({
                items: state.items.map((item: any) =>
                  item.id === threadItem.id ? threadItem : item,
                ),
              }));
            }
          } else if (event.eventType === "DELETE" && event.old) {
            // Remove message from thread
            const threadItem = transformMessagesToThreadItems([event.old])[0];
            if (threadItem) {
              set((state: any) => ({
                items: state.items.filter((item: any) => item.id !== threadItem.id),
              }));
            }
          }
        },
        onError: (error) => {
          set({ error: `Real-time error: ${error.message}` });
        },
      },
    );

    return realtimeUnsubscribe;
  },

  unsubscribeFromRealtime: () => {
    if (realtimeUnsubscribe) {
      realtimeUnsubscribe();
      realtimeUnsubscribe = null;
    }
  },

  // Utility methods
  setError: (error: string | null) => set({ error }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setSaving: (saving: boolean) => set({ isSaving: saving }),
}));
