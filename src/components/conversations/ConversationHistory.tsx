import React, { useState, useCallback, useMemo } from "react";
import {
  useConversations,
  useSearchConversations,
  useDeleteConversation,
  usePrefetchConversation,
} from "../../hooks/useConversations";
import { useThreadStore } from "../../stores/thread/store";
import { ConversationItem } from "./ConversationItem";
import { ConversationSearch } from "./ConversationSearch";
import { ConversationActions } from "./ConversationActions";
import { ConversationEmptyState } from "./ConversationEmptyState";
import type { Conversation } from "../../types/conversations";
import styles from "./ConversationHistory.module.css";

interface ConversationHistoryProps {
  onSelectConversation?: (conversationId: string) => void;
  className?: string;
  showNewButton?: boolean;
}

export function ConversationHistory({
  onSelectConversation,
  className,
  showNewButton = true,
}: ConversationHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Store state
  const {
    currentConversationId,
    loadConversation,
    createNewConversation,
    isLoading: threadLoading,
    error: threadError,
  } = useThreadStore();

  // Queries
  const {
    data: conversations,
    isLoading: conversationsLoading,
    error: conversationsError,
  } = useConversations();

  const { data: searchResults, isLoading: searchLoading } = useSearchConversations(
    searchQuery,
    isSearchMode && searchQuery.length > 2,
  );

  // Mutations
  const deleteConversationMutation = useDeleteConversation();
  const prefetchConversation = usePrefetchConversation();

  // Handlers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setIsSearchMode(query.length > 0);
  }, []);

  const handleSelectConversation = useCallback(
    async (conversation: Conversation) => {
      try {
        await loadConversation(conversation.id);
        onSelectConversation?.(conversation.id);
      } catch {
        // Error: Failed to load conversation
      }
    },
    [loadConversation, onSelectConversation],
  );

  const handleCreateNew = useCallback(async () => {
    try {
      const conversationId = await createNewConversation();
      onSelectConversation?.(conversationId);
    } catch {
      // Error: Failed to create conversation
    }
  }, [createNewConversation, onSelectConversation]);

  const handleDeleteConversation = useCallback(
    async (conversationId: string, event: React.MouseEvent) => {
      event.stopPropagation();

      if (!window.confirm("Are you sure you want to delete this conversation?")) {
        return;
      }

      try {
        await deleteConversationMutation.mutateAsync(conversationId);
      } catch {
        // Error: Failed to delete conversation
      }
    },
    [deleteConversationMutation],
  );

  const handleMouseEnter = useCallback(
    (conversationId: string) => {
      prefetchConversation(conversationId);
    },
    [prefetchConversation],
  );

  // Computed values
  const displayedConversations = useMemo(() => {
    if (isSearchMode && searchResults) {
      return searchResults;
    }
    return conversations || [];
  }, [isSearchMode, searchResults, conversations]);

  const isLoading = conversationsLoading || searchLoading || threadLoading;
  const error = conversationsError || threadError;

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <ConversationActions
        showNewButton={showNewButton}
        isLoading={isLoading}
        onCreateNew={handleCreateNew}
      />

      <ConversationSearch
        searchQuery={searchQuery}
        isSearchMode={isSearchMode}
        onSearch={handleSearch}
      />

      {/* Error Display */}
      {error && (
        <div className={styles.error}>
          {typeof error === "string" ? error : "An error occurred"}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          Loading conversations...
        </div>
      )}

      {/* Conversations List */}
      <div className={styles.conversationsList}>
        {displayedConversations.length === 0 && !isLoading && (
          <ConversationEmptyState
            isSearchMode={isSearchMode}
            searchQuery={searchQuery}
            onCreateNew={handleCreateNew}
          />
        )}

        {displayedConversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isActive={conversation.id === currentConversationId}
            onSelect={() => handleSelectConversation(conversation)}
            onDelete={(e) => handleDeleteConversation(conversation.id, e)}
            onMouseEnter={() => handleMouseEnter(conversation.id)}
            isDeleting={deleteConversationMutation.isPending}
          />
        ))}
      </div>
    </div>
  );
}
