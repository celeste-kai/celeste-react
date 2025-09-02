import React from "react";
import styles from "./ConversationHistory.module.css";

interface ConversationSearchProps {
  searchQuery: string;
  isSearchMode: boolean;
  onSearch: (query: string) => void;
}

export function ConversationSearch({
  searchQuery,
  isSearchMode,
  onSearch,
}: ConversationSearchProps) {
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search conversations..."
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        className={styles.searchInput}
      />
      {isSearchMode && (
        <button
          className={styles.clearSearch}
          onClick={() => onSearch("")}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
