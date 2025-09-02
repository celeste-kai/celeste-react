import { supabase } from "../../lib/supabase";
import type {
  Conversation,
  ConversationMessage,
  CreateConversationRequest,
  UpdateConversationRequest,
  CreateMessageRequest,
  UpdateMessageRequest,
  ConversationListOptions,
  ConversationMessagesOptions,
} from "../../types/conversations";
import {
  transformDatabaseConversation,
  transformDatabaseMessage,
} from "../../utils/conversationTransforms";

export class ConversationsCrudService {
  /**
   * Create a new conversation
   */
  async createConversation(data: CreateConversationRequest): Promise<Conversation> {
    // Get the current authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    const { data: conversation, error } = await supabase
      .from("conversations")
      .insert([
        {
          title: data.title || "New Conversation",
          metadata: data.metadata || {},
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create conversation: ${error.message}`);
    }

    return transformDatabaseConversation(conversation);
  }

  /**
   * Get a conversation by ID
   */
  async getConversation(id: string): Promise<Conversation | null> {
    const { data: conversation, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Not found
      }
      throw new Error(`Failed to get conversation: ${error.message}`);
    }

    return transformDatabaseConversation(conversation);
  }

  /**
   * List conversations for the current user
   */
  async listConversations(
    options: ConversationListOptions = {},
  ): Promise<Conversation[]> {
    const {
      limit = 50,
      offset = 0,
      order_by = "updated_at",
      order_direction = "desc",
    } = options;

    let query = supabase
      .from("conversations")
      .select("*")
      .order(order_by, { ascending: order_direction === "asc" })
      .range(offset, offset + limit - 1);

    const { data: conversations, error } = await query;

    if (error) {
      throw new Error(`Failed to list conversations: ${error.message}`);
    }

    return (conversations || []).map(transformDatabaseConversation);
  }

  /**
   * Update a conversation
   */
  async updateConversation(
    id: string,
    data: UpdateConversationRequest,
  ): Promise<Conversation> {
    const { data: conversation, error } = await supabase
      .from("conversations")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update conversation: ${error.message}`);
    }

    return transformDatabaseConversation(conversation);
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(id: string): Promise<void> {
    const { error } = await supabase.from("conversations").delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete conversation: ${error.message}`);
    }
  }

  /**
   * Add a message to a conversation
   */
  async createMessage(data: CreateMessageRequest): Promise<ConversationMessage> {
    // Get the current authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    // Use timestamp-based ordering to avoid race conditions
    // Convert current timestamp to microseconds for unique ordering
    const orderIndex = Date.now() * 1000 + Math.floor(Math.random() * 1000);

    const { data: message, error } = await supabase
      .from("conversation_messages")
      .insert([
        {
          ...data,
          user_id: user.id,
          order_index: orderIndex,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create message: ${error.message}`);
    }

    return transformDatabaseMessage(message);
  }

  /**
   * Get messages for a conversation
   */
  async getConversationMessages(
    conversationId: string,
    options: ConversationMessagesOptions = {},
  ): Promise<ConversationMessage[]> {
    const {
      limit = 100,
      offset = 0,
      order_by = "order_index",
      order_direction = "asc",
    } = options;

    const { data: messages, error } = await supabase
      .from("conversation_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order(order_by, { ascending: order_direction === "asc" })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to get conversation messages: ${error.message}`);
    }

    return (messages || []).map(transformDatabaseMessage);
  }

  /**
   * Update a message
   */
  async updateMessage(
    id: string,
    data: UpdateMessageRequest,
  ): Promise<ConversationMessage> {
    const { data: message, error } = await supabase
      .from("conversation_messages")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update message: ${error.message}`);
    }

    return transformDatabaseMessage(message);
  }

  /**
   * Delete a message
   */
  async deleteMessage(id: string): Promise<void> {
    const { error } = await supabase
      .from("conversation_messages")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  }
}

// Export singleton instance
export const conversationsCrudService = new ConversationsCrudService();
