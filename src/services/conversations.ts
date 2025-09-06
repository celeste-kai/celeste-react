import { supabase } from "../lib/supabase";
import type { DatabaseConversation, DatabaseMessage } from "../types/conversations";

// Simple direct Supabase operations for conversations
export const conversationsService = {
  async listConversations(options: { limit?: number; offset?: number } = {}) {
    const offset = options.offset || 0;
    const limit = options.limit || 20;
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1);
    return data || [];
  },

  async getConversationWithSummary(id: string) {
    const { data } = await supabase
      .from("conversations")
      .select("*, conversation_messages(*)")
      .eq("id", id)
      .single();
    return data;
  },

  async createConversation(data: Partial<DatabaseConversation>) {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {

      // eslint-disable-next-line no-undef
      console.error("User not authenticated");
      return null;
    }

    const { data: conversation, error } = await supabase
      .from("conversations")
      .insert({ ...data, user_id: user.id })
      .select()
      .single();

    if (error) {

      // eslint-disable-next-line no-undef
      console.error("Supabase error:", error);
      throw error;
    }

    return conversation;
  },

  async updateConversation(id: string, data: Partial<DatabaseConversation>) {
    const { data: conversation } = await supabase
      .from("conversations")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    return conversation;
  },

  async deleteConversation(id: string) {
    await supabase.from("conversations").delete().eq("id", id);
  },

  async getConversationMessages(conversationId: string) {
    const { data } = await supabase
      .from("conversation_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    return data || [];
  },

  async createMessage(message: Partial<DatabaseMessage>) {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {

      // eslint-disable-next-line no-undef
      console.error("User not authenticated");
      return null;
    }

    const { data, error } = await supabase
      .from("conversation_messages")
      .insert({ ...message, user_id: user.id })
      .select()
      .single();

    if (error) {

      // eslint-disable-next-line no-undef
      console.error("Supabase error:", error);
      throw error;
    }

    return data;
  },

  async deleteMessage(id: string) {
    await supabase.from("conversation_messages").delete().eq("id", id);
  },

  async searchConversations(query: string) {
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .ilike("title", `%${query}%`)
      .order("updated_at", { ascending: false });
    return data || [];
  },
};
