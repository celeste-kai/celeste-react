import type { ThreadItem } from "../domain/thread";
import type {
  Conversation,
  ConversationMessage,
  DatabaseConversation,
  DatabaseMessage,
  CreateMessageRequest,
} from "../types/conversations";

export function transformDatabaseConversation(db: DatabaseConversation): Conversation {
  return {
    ...db,
    created_at: new Date(db.created_at),
    updated_at: new Date(db.updated_at),
  };
}

export function transformDatabaseMessage(db: DatabaseMessage): ConversationMessage {
  return { ...db, created_at: new Date(db.created_at) };
}

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

export function transformMessagesToThreadItems(
  messages: ConversationMessage[],
): ThreadItem[] {
  if (!messages) return [];
  return messages
    .sort((a, b) => a.order_index - b.order_index)
    .map(transformMessageToThreadItem);
}

export function transformThreadItemsToMessages(
  threadItems: ThreadItem[],
  conversationId: string,
  _userId: string,
): Array<Omit<CreateMessageRequest, "conversation_id"> & { conversation_id: string }> {
  return threadItems.map((item) => ({
    conversation_id: conversationId,
    role: item.role,
    capability: item.capability,
    provider: item.provider,
    model: item.model,
    content: item.parts,
    metadata: { original_id: item.id, created_at: item.createdAt },
  }));
}

export function generateConversationTitle(threadItems: ThreadItem[]): string {
  const firstUserMessage = threadItems.find((item) => item.role === "user");
  if (!firstUserMessage?.parts?.length) return "New Conversation";
  const firstTextPart = firstUserMessage.parts.find((part) => part.kind === "text");
  if (firstTextPart && "content" in firstTextPart) {
    const content = firstTextPart.content.toString().trim();
    return content.length > 50 ? content.substring(0, 47) + "..." : content;
  }
  const capability = firstUserMessage.capability;
  return capability === "image"
    ? "Image Generation"
    : capability === "video"
      ? "Video Generation"
      : "New Conversation";
}
