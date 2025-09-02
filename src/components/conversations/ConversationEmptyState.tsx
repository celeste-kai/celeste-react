import React from "react";
import styles from "./ConversationHistory.module.css";

interface ConversationEmptyStateProps {
  isSearchMode: boolean;
  searchQuery: string;
  onCreateNew: () => void;
}

export function ConversationEmptyState({
  isSearchMode,
  searchQuery,
  onCreateNew,
}: ConversationEmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      {isSearchMode ? (
        <>
          <p>No conversations found for "{searchQuery}"</p>
          <button className={styles.createButton} onClick={onCreateNew}>
            Create new conversation
          </button>
        </>
      ) : (
        <>
          <p>No conversations yet</p>
          <p className={styles.subtitle}>Start by creating your first conversation</p>
          <button className={styles.createButton} onClick={onCreateNew}>
            Create your first conversation
          </button>
        </>
      )}
    </div>
  );
}
