import type { ContentPart, Role } from "../domain/thread";
import type { CapabilityId } from "../lib/store/selections";

// Database types matching our Supabase schema
export interface DatabaseConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown>;
}

export interface DatabaseConversationMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  role: Role;
  capability: CapabilityId;
  provider: string;
  model: string;
  content: ContentPart[];
  created_at: string;
  order_index: number;
  metadata: Record<string, unknown>;
}

export interface DatabaseConversationAttachment {
  id: string;
  message_id: string;
  file_path: string;
  mime_type: string;
  file_size?: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Client-side types with computed properties
export interface Conversation
  extends Omit<DatabaseConversation, "created_at" | "updated_at"> {
  created_at: Date;
  updated_at: Date;
  message_count?: number;
  last_message_at?: Date;
}

export interface ConversationMessage
  extends Omit<DatabaseConversationMessage, "created_at"> {
  created_at: Date;
  attachments?: ConversationAttachment[];
}

export interface ConversationAttachment
  extends Omit<DatabaseConversationAttachment, "created_at"> {
  created_at: Date;
}

// API request/response types
export interface CreateConversationRequest {
  title?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateConversationRequest {
  title?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateMessageRequest {
  conversation_id: string;
  role: Role;
  capability: CapabilityId;
  provider: string;
  model: string;
  content: ContentPart[];
  metadata?: Record<string, unknown>;
}

export interface UpdateMessageRequest {
  content?: ContentPart[];
  metadata?: Record<string, unknown>;
}

// Pagination types
export interface ConversationListOptions {
  limit?: number;
  offset?: number;
  order_by?: "created_at" | "updated_at";
  order_direction?: "asc" | "desc";
}

export interface ConversationMessagesOptions {
  limit?: number;
  offset?: number;
  order_by?: "created_at" | "order_index";
  order_direction?: "asc" | "desc";
}

// Real-time event types
export interface ConversationRealtimeEvent {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new?: Conversation;
  old?: Conversation;
}

export interface MessageRealtimeEvent {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new?: ConversationMessage;
  old?: ConversationMessage;
}
