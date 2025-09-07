import React, { useCallback } from "react";
import type { Conversation } from "../../domain/entities/Conversation";
import styles from "./ConversationHistory.module.css";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  isDeleting: boolean;
  onSelect: () => void;
  onDelete: (event: React.MouseEvent) => void;
  onMouseEnter: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  isDeleting,
  onSelect,
  onDelete,
  onMouseEnter,
}: ConversationItemProps) {
  const formatDate = useCallback((date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }, []);

  return (
    <div
      className={`${styles.conversationItem} ${isActive ? styles.active : ""}`}
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
    >
      <div className={styles.conversationContent}>
        <div className={styles.conversationTitle}>{conversation.getTitle()}</div>
        <div className={styles.conversationMeta}>
          {formatDate(conversation.getUpdatedAt())}
        </div>
      </div>

      <button
        className={styles.deleteButton}
        onClick={onDelete}
        disabled={isDeleting}
        aria-label="Delete conversation"
        title="Delete conversation"
      >
        {isDeleting ? "..." : "×"}
      </button>
    </div>
  );
}
