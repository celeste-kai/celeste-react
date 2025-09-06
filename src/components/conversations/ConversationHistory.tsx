import { useState } from "react";
import { useThreadStore } from "../../stores/thread/store";
import { useConversations } from "../../hooks/useConversations";
import { ConversationItem } from "./ConversationItem";
import type { Conversation } from "../../types/conversations";
import styles from "./ConversationHistory.module.css";

export default function ConversationHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const { currentConversationId, loadConversation, clear } = useThreadStore();
  const { data: conversations = [] } = useConversations();

  const filteredConversations = searchQuery
    ? conversations.filter((c: Conversation) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : conversations;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Conversations</h3>
        <button onClick={clear} className={styles.newButton}>
          New Chat
        </button>
      </div>

      <input
        className={styles.searchInput}
        type="text"
        placeholder="Search conversations..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className={styles.list}>
        {filteredConversations.map((conversation: Conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isActive={conversation.id === currentConversationId}
            isDeleting={false}
            onSelect={() => loadConversation(conversation.id)}
            onDelete={() => {}}
            onMouseEnter={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
