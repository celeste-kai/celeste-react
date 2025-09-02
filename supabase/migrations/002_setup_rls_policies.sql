-- Migration: Set up Row Level Security policies
-- Date: 2025-01-29

-- Enable RLS on all tables
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_attachments ENABLE ROW LEVEL SECURITY;

-- Conversations policies
-- Users can only see their own conversations
CREATE POLICY "Users can view their own conversations" ON conversations
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own conversations
CREATE POLICY "Users can create their own conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own conversations
CREATE POLICY "Users can update their own conversations" ON conversations
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Users can delete their own conversations
CREATE POLICY "Users can delete their own conversations" ON conversations
  FOR DELETE USING (auth.uid() = user_id);

-- Conversation messages policies
-- Users can view messages in their conversations
CREATE POLICY "Users can view messages in their conversations" ON conversation_messages
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- Users can create messages in their conversations
CREATE POLICY "Users can create messages in their conversations" ON conversation_messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- Users can update messages in their conversations
CREATE POLICY "Users can update messages in their conversations" ON conversation_messages
  FOR UPDATE USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  ) WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- Users can delete messages in their conversations
CREATE POLICY "Users can delete messages in their conversations" ON conversation_messages
  FOR DELETE USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- Conversation attachments policies
-- Users can view attachments in their conversations
CREATE POLICY "Users can view attachments in their conversations" ON conversation_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_messages
      JOIN conversations ON conversations.id = conversation_messages.conversation_id
      WHERE conversation_messages.id = conversation_attachments.message_id
      AND conversations.user_id = auth.uid()
    )
  );

-- Users can create attachments in their conversations
CREATE POLICY "Users can create attachments in their conversations" ON conversation_attachments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversation_messages
      JOIN conversations ON conversations.id = conversation_messages.conversation_id
      WHERE conversation_messages.id = conversation_attachments.message_id
      AND conversations.user_id = auth.uid()
    )
  );

-- Users can update attachments in their conversations
CREATE POLICY "Users can update attachments in their conversations" ON conversation_attachments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM conversation_messages
      JOIN conversations ON conversations.id = conversation_messages.conversation_id
      WHERE conversation_messages.id = conversation_attachments.message_id
      AND conversations.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversation_messages
      JOIN conversations ON conversations.id = conversation_messages.conversation_id
      WHERE conversation_messages.id = conversation_attachments.message_id
      AND conversations.user_id = auth.uid()
    )
  );

-- Users can delete attachments in their conversations
CREATE POLICY "Users can delete attachments in their conversations" ON conversation_attachments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM conversation_messages
      JOIN conversations ON conversations.id = conversation_messages.conversation_id
      WHERE conversation_messages.id = conversation_attachments.message_id
      AND conversations.user_id = auth.uid()
    )
  );
