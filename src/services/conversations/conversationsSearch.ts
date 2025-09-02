import { supabase } from "../../lib/supabase";
import type { Conversation, DatabaseConversation } from "../../types/conversations";
import { transformDatabaseConversation } from "../../utils/conversationTransforms";

export class ConversationsSearchService {
  /**
   * Search conversations by title or message content
   */
  async searchConversations(query: string, limit = 20): Promise<Conversation[]> {
    // Search in conversation titles
    const { data: titleResults, error: titleError } = await supabase
      .from("conversations")
      .select("*")
      .ilike("title", `%${query}%`)
      .limit(limit);

    if (titleError) {
      throw new Error(`Failed to search conversations: ${titleError.message}`);
    }

    // Search in message content (this is a simplified search - you might want to use full-text search)
    const { data: messageResults, error: messageError } = await supabase
      .from("conversation_messages")
      .select(
        `
        conversation_id,
        conversations (*)
      `,
      )
      .textSearch("content", query)
      .limit(limit);

    if (messageError) {
      // Warning: Message search failed - continue with title results only
    }

    // Combine and deduplicate results
    const conversationIds = new Set<string>();
    const allResults: DatabaseConversation[] = [];

    // Add title matches
    (titleResults || []).forEach((conv) => {
      if (!conversationIds.has(conv.id)) {
        conversationIds.add(conv.id);
        allResults.push(conv);
      }
    });

    // Add message matches
    (messageResults || []).forEach((result: any) => {
      if (result.conversations && !conversationIds.has(result.conversations.id)) {
        conversationIds.add(result.conversations.id);
        allResults.push(result.conversations);
      }
    });

    return allResults.map(transformDatabaseConversation);
  }

  /**
   * Search conversations by capability type
   */
  async searchByCapability(capability: string, limit = 20): Promise<Conversation[]> {
    const { data: messageResults, error } = await supabase
      .from("conversation_messages")
      .select(
        `
        conversation_id,
        conversations (*)
      `,
      )
      .eq("capability", capability)
      .limit(limit);

    if (error) {
      throw new Error(`Failed to search by capability: ${error.message}`);
    }

    // Deduplicate conversations
    const conversationIds = new Set<string>();
    const uniqueConversations: DatabaseConversation[] = [];

    (messageResults || []).forEach((result: any) => {
      if (result.conversations && !conversationIds.has(result.conversations.id)) {
        conversationIds.add(result.conversations.id);
        uniqueConversations.push(result.conversations);
      }
    });

    return uniqueConversations.map(transformDatabaseConversation);
  }

  /**
   * Search conversations by provider
   */
  async searchByProvider(provider: string, limit = 20): Promise<Conversation[]> {
    const { data: messageResults, error } = await supabase
      .from("conversation_messages")
      .select(
        `
        conversation_id,
        conversations (*)
      `,
      )
      .eq("provider", provider)
      .limit(limit);

    if (error) {
      throw new Error(`Failed to search by provider: ${error.message}`);
    }

    // Deduplicate conversations
    const conversationIds = new Set<string>();
    const uniqueConversations: DatabaseConversation[] = [];

    (messageResults || []).forEach((result: any) => {
      if (result.conversations && !conversationIds.has(result.conversations.id)) {
        conversationIds.add(result.conversations.id);
        uniqueConversations.push(result.conversations);
      }
    });

    return uniqueConversations.map(transformDatabaseConversation);
  }

  /**
   * Advanced search with multiple filters
   */
  async advancedSearch({
    query,
    capability,
    provider,
    dateFrom,
    dateTo,
    limit = 20,
  }: {
    query?: string;
    capability?: string;
    provider?: string;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
  }): Promise<Conversation[]> {
    let conversationQuery = supabase.from("conversations").select("*");

    // Apply date filters to conversations
    if (dateFrom) {
      conversationQuery = conversationQuery.gte("created_at", dateFrom.toISOString());
    }
    if (dateTo) {
      conversationQuery = conversationQuery.lte("created_at", dateTo.toISOString());
    }

    // Apply text search to title
    if (query) {
      conversationQuery = conversationQuery.ilike("title", `%${query}%`);
    }

    conversationQuery = conversationQuery.limit(limit);

    const { data: conversations, error: convError } = await conversationQuery;

    if (convError) {
      throw new Error(`Failed to search conversations: ${convError.message}`);
    }

    let filteredConversations = conversations || [];

    // If we need to filter by capability or provider, we need to check messages
    if (capability || provider) {
      const conversationIds = filteredConversations.map((c) => c.id);

      if (conversationIds.length > 0) {
        let messageQuery = supabase
          .from("conversation_messages")
          .select("conversation_id")
          .in("conversation_id", conversationIds);

        if (capability) {
          messageQuery = messageQuery.eq("capability", capability);
        }
        if (provider) {
          messageQuery = messageQuery.eq("provider", provider);
        }

        const { data: matchingMessages, error: msgError } = await messageQuery;

        if (msgError) {
          throw new Error(`Failed to filter by message criteria: ${msgError.message}`);
        }

        const matchingConversationIds = new Set(
          (matchingMessages || []).map((m) => m.conversation_id),
        );

        filteredConversations = filteredConversations.filter((c) =>
          matchingConversationIds.has(c.id),
        );
      }
    }

    return filteredConversations.map(transformDatabaseConversation);
  }
}

// Export singleton instance
export const conversationsSearchService = new ConversationsSearchService();
