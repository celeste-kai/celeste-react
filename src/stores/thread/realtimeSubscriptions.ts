import { create } from "zustand";
import { conversationRealtimeService } from "../../services/conversationRealtimeService";
import { transformMessagesToThreadItems } from "../../utils/conversationTransforms";
import type { ThreadItem } from "../../domain/thread";

export interface RealtimeSubscriptionsState {
  activeSubscriptions: Set<string>;

  // Real-time methods
  subscribeToCurrentConversation: (
    conversationId: string,
    updateThreadItems: (updater: (items: ThreadItem[]) => ThreadItem[]) => void,
    setError: (error: string) => void,
  ) => () => void;
  unsubscribeFromRealtime: () => void;
  unsubscribeFromConversation: (conversationId: string) => void;
}

let realtimeUnsubscribe: (() => void) | null = null;

export const useRealtimeSubscriptions = create<RealtimeSubscriptionsState>(
  (set, _get) => ({
    activeSubscriptions: new Set(),

    subscribeToCurrentConversation: (conversationId, updateThreadItems, setError) => {
      if (!conversationId) {
        return () => {};
      }

      // Unsubscribe from previous subscription
      if (realtimeUnsubscribe) {
        realtimeUnsubscribe();
      }

      realtimeUnsubscribe = conversationRealtimeService.subscribeToConversation(
        conversationId,
        {
          onMessageChange: (event) => {
            if (event.eventType === "INSERT" && event.new) {
              // Add new message to thread
              const threadItem = transformMessagesToThreadItems([event.new])[0];
              if (threadItem) {
                updateThreadItems((items) => [...items, threadItem]);
              }
            } else if (event.eventType === "UPDATE" && event.new) {
              // Update existing message
              const threadItem = transformMessagesToThreadItems([event.new])[0];
              if (threadItem) {
                updateThreadItems((items) =>
                  items.map((item) => (item.id === threadItem.id ? threadItem : item)),
                );
              }
            } else if (event.eventType === "DELETE" && event.old) {
              // Remove message from thread
              const threadItem = transformMessagesToThreadItems([event.old])[0];
              if (threadItem) {
                updateThreadItems((items) =>
                  items.filter((item) => item.id !== threadItem.id),
                );
              }
            }
          },
          onError: (error) => {
            setError(`Real-time error: ${error.message}`);
          },
        },
      );

      // Track active subscription
      set((state) => ({
        activeSubscriptions: new Set([...state.activeSubscriptions, conversationId]),
      }));

      return realtimeUnsubscribe;
    },

    unsubscribeFromRealtime: () => {
      if (realtimeUnsubscribe) {
        realtimeUnsubscribe();
        realtimeUnsubscribe = null;
      }
      set({ activeSubscriptions: new Set() });
    },

    unsubscribeFromConversation: (conversationId: string) => {
      conversationRealtimeService.unsubscribeFromConversation(conversationId);
      set((state) => {
        const newSubscriptions = new Set(state.activeSubscriptions);
        newSubscriptions.delete(conversationId);
        return { activeSubscriptions: newSubscriptions };
      });
    },
  }),
);
