import { supabase } from "../lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type {
  ConversationRealtimeEvent,
  MessageRealtimeEvent,
  DatabaseConversation,
  DatabaseConversationMessage,
} from "../types/conversations";
import {
  transformDatabaseConversation,
  transformDatabaseMessage,
} from "../utils/conversationTransforms";

export interface ConversationRealtimeCallbacks {
  onConversationChange?: (event: ConversationRealtimeEvent) => void;
  onMessageChange?: (event: MessageRealtimeEvent) => void;
  onError?: (error: Error) => void;
}

export class ConversationRealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();

  /**
   * Subscribe to changes for a specific conversation
   */
  subscribeToConversation(
    conversationId: string,
    callbacks: ConversationRealtimeCallbacks,
  ): () => void {
    const channelName = `conversation:${conversationId}`;

    // Remove existing channel if it exists
    this.unsubscribeFromConversation(conversationId);

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
          filter: `id=eq.${conversationId}`,
        },
        (payload) => {
          try {
            if (callbacks.onConversationChange) {
              const event: ConversationRealtimeEvent = {
                eventType: payload.eventType as any,
                new: payload.new
                  ? transformDatabaseConversation(payload.new as DatabaseConversation)
                  : undefined,
                old: payload.old
                  ? transformDatabaseConversation(payload.old as DatabaseConversation)
                  : undefined,
              };
              callbacks.onConversationChange(event);
            }
          } catch (error) {
            callbacks.onError?.(
              error instanceof Error ? error : new Error("Unknown error"),
            );
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversation_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          try {
            if (callbacks.onMessageChange) {
              const event: MessageRealtimeEvent = {
                eventType: payload.eventType as any,
                new: payload.new
                  ? transformDatabaseMessage(payload.new as DatabaseConversationMessage)
                  : undefined,
                old: payload.old
                  ? transformDatabaseMessage(payload.old as DatabaseConversationMessage)
                  : undefined,
              };
              callbacks.onMessageChange(event);
            }
          } catch (error) {
            callbacks.onError?.(
              error instanceof Error ? error : new Error("Unknown error"),
            );
          }
        },
      )
      .subscribe();

    this.channels.set(conversationId, channel);

    // Return unsubscribe function
    return () => this.unsubscribeFromConversation(conversationId);
  }

  /**
   * Subscribe to all conversations for the current user
   */
  subscribeToUserConversations(callbacks: ConversationRealtimeCallbacks): () => void {
    const channelName = "user-conversations";

    // Remove existing channel if it exists
    this.unsubscribeFromChannel(channelName);

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        (payload) => {
          try {
            if (callbacks.onConversationChange) {
              const event: ConversationRealtimeEvent = {
                eventType: payload.eventType as any,
                new: payload.new
                  ? transformDatabaseConversation(payload.new as DatabaseConversation)
                  : undefined,
                old: payload.old
                  ? transformDatabaseConversation(payload.old as DatabaseConversation)
                  : undefined,
              };
              callbacks.onConversationChange(event);
            }
          } catch (error) {
            callbacks.onError?.(
              error instanceof Error ? error : new Error("Unknown error"),
            );
          }
        },
      )
      .subscribe();

    this.channels.set(channelName, channel);

    // Return unsubscribe function
    return () => this.unsubscribeFromChannel(channelName);
  }

  /**
   * Unsubscribe from a specific conversation
   */
  unsubscribeFromConversation(conversationId: string): void {
    const channel = this.channels.get(conversationId);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(conversationId);
    }
  }

  /**
   * Unsubscribe from a specific channel by name
   */
  private unsubscribeFromChannel(channelName: string): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }

  /**
   * Unsubscribe from all channels
   */
  unsubscribeFromAll(): void {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }

  /**
   * Get the status of a subscription
   */
  getSubscriptionStatus(conversationId: string): string {
    const channel = this.channels.get(conversationId);
    return channel?.state || "not_subscribed";
  }

  /**
   * Check if subscribed to a conversation
   */
  isSubscribedToConversation(conversationId: string): boolean {
    const channel = this.channels.get(conversationId);
    return channel?.state === "joined";
  }

  /**
   * Get all active subscription keys
   */
  getActiveSubscriptions(): string[] {
    return Array.from(this.channels.keys());
  }
}

// Export singleton instance
export const conversationRealtimeService = new ConversationRealtimeService();
