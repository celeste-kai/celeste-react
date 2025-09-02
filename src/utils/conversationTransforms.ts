import type { ThreadItem } from "../domain/thread";
import type {
  Conversation,
  ConversationMessage,
  DatabaseConversation,
  DatabaseConversationMessage,
  CreateMessageRequest,
} from "../types/conversations";

/**
 * Transforms a database conversation to client-side conversation
 */
export function transformDatabaseConversation(
  dbConversation: DatabaseConversation,
): Conversation {
  return {
    ...dbConversation,
    created_at: new Date(dbConversation.created_at),
    updated_at: new Date(dbConversation.updated_at),
  };
}

/**
 * Transforms a database conversation message to client-side message
 */
export function transformDatabaseMessage(
  dbMessage: DatabaseConversationMessage,
): ConversationMessage {
  return {
    ...dbMessage,
    created_at: new Date(dbMessage.created_at),
  };
}

/**
 * Transforms a ThreadItem to a database conversation message
 */
export function transformThreadItemToMessage(
  threadItem: ThreadItem,
  conversationId: string,
  _userId: string,
  _orderIndex: number,
): Omit<CreateMessageRequest, "conversation_id"> & { conversation_id: string } {
  return {
    conversation_id: conversationId,
    role: threadItem.role,
    capability: threadItem.capability,
    provider: threadItem.provider,
    model: threadItem.model,
    content: threadItem.parts,
    metadata: {
      original_id: threadItem.id,
      created_at: threadItem.createdAt,
    },
  };
}

/**
 * Transforms a conversation message to a ThreadItem
 */
export function transformMessageToThreadItem(message: ConversationMessage): ThreadItem {
  return {
    id: (message.metadata?.original_id as string) || message.id,
    role: message.role,
    capability: message.capability,
    provider: message.provider,
    model: message.model,
    parts: message.content,
    createdAt:
      typeof message.metadata?.created_at === "number"
        ? message.metadata.created_at
        : message.created_at.getTime(),
  };
}

/**
 * Transforms an array of ThreadItems to database messages
 */
export function transformThreadItemsToMessages(
  threadItems: ThreadItem[],
  conversationId: string,
  userId: string,
): Array<Omit<CreateMessageRequest, "conversation_id"> & { conversation_id: string }> {
  return threadItems.map((item, index) =>
    transformThreadItemToMessage(item, conversationId, userId, index),
  );
}

/**
 * Transforms an array of conversation messages to ThreadItems
 */
export function transformMessagesToThreadItems(
  messages: ConversationMessage[],
): ThreadItem[] {
  return messages
    .sort((a, b) => a.order_index - b.order_index)
    .map(transformMessageToThreadItem);
}

/**
 * Generates a conversation title from the first user message
 */
export function generateConversationTitle(threadItems: ThreadItem[]): string {
  const firstUserMessage = threadItems.find((item) => item.role === "user");

  if (!firstUserMessage?.parts?.length) {
    return "New Conversation";
  }

  // Find the first text part
  const firstTextPart = firstUserMessage.parts.find((part) => part.kind === "text");
  if (firstTextPart && "content" in firstTextPart) {
    const content = firstTextPart.content.toString().trim();
    // Truncate to first 50 characters and add ellipsis if needed
    return content.length > 50 ? content.substring(0, 47) + "..." : content;
  }

  // If no text part, generate title based on capability
  const capability = firstUserMessage.capability;
  switch (capability) {
    case "image":
      return "Image Generation";
    case "video":
      return "Video Generation";
    case "text":
    default:
      return "New Conversation";
  }
}

/**
 * Creates a conversation summary from messages
 */
export function createConversationSummary(messages: ConversationMessage[]): {
  messageCount: number;
  lastMessageAt: Date;
  capabilities: string[];
  providers: string[];
} {
  if (!messages.length) {
    return {
      messageCount: 0,
      lastMessageAt: new Date(),
      capabilities: [],
      providers: [],
    };
  }

  const sortedMessages = messages.sort(
    (a, b) => b.created_at.getTime() - a.created_at.getTime(),
  );

  const capabilities = [...new Set(messages.map((m) => m.capability))];
  const providers = [...new Set(messages.map((m) => m.provider))];

  return {
    messageCount: messages.length,
    lastMessageAt: sortedMessages[0].created_at,
    capabilities,
    providers,
  };
}
