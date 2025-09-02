-- Migration: Fix order_index column to support large timestamp values
-- Date: 2025-01-29
-- Issue: INTEGER type cannot handle microsecond timestamp values

-- Change order_index from INTEGER to BIGINT to support large timestamp values
ALTER TABLE conversation_messages
ALTER COLUMN order_index TYPE BIGINT;

-- The unique constraint will automatically work with BIGINT
-- No need to recreate the constraint: CONSTRAINT unique_conversation_order UNIQUE (conversation_id, order_index)

-- Update any existing indexes to use BIGINT (they should automatically adapt)
-- The existing index idx_conversation_messages_order will continue to work with BIGINT
