-- Migration: Create conversations and messages schema
-- Date: 2025-01-29

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Add indexes for better performance
  CONSTRAINT conversations_title_not_empty CHECK (LENGTH(title) > 0)
);

-- Create conversation_messages table
CREATE TABLE conversation_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  capability TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  order_index INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Ensure proper ordering within conversations
  CONSTRAINT unique_conversation_order UNIQUE (conversation_id, order_index)
);

-- Create conversation_attachments table for large media files
CREATE TABLE conversation_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES conversation_messages(id) ON DELETE CASCADE NOT NULL,
  file_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size BIGINT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX idx_conversation_messages_conversation_id ON conversation_messages(conversation_id);
CREATE INDEX idx_conversation_messages_order ON conversation_messages(conversation_id, order_index);
CREATE INDEX idx_conversation_messages_created_at ON conversation_messages(created_at);
CREATE INDEX idx_conversation_attachments_message_id ON conversation_attachments(message_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update conversation's updated_at when messages are added/modified
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET updated_at = NOW()
  WHERE id = COALESCE(NEW.conversation_id, OLD.conversation_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_conversation_on_message_change
  AFTER INSERT OR UPDATE OR DELETE ON conversation_messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_timestamp();
