import React from "react";
import styles from "./ConversationHistory.module.css";

interface ConversationActionsProps {
  showNewButton: boolean;
  isLoading: boolean;
  onCreateNew: () => void;
}

export function ConversationActions({
  showNewButton,
  isLoading,
  onCreateNew,
}: ConversationActionsProps) {
  if (!showNewButton) {
    return null;
  }

  return (
    <div className={styles.header}>
      <h2 className={styles.title}>Conversations</h2>
      <button className={styles.newButton} onClick={onCreateNew} disabled={isLoading}>
        + New
      </button>
    </div>
  );
}
