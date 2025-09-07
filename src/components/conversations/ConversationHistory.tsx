import { useState } from "react";
import { useThreadStore } from "../../stores/thread.store";
import { useConversation } from "../../hooks/useConversation";
import { useThread } from "../../hooks/useThread";
import { ConversationItem } from "./ConversationItem";
import styles from "./ConversationHistory.module.css";

export default function ConversationHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const { conversationId } = useThreadStore();
  const { conversations, deleteConversation } = useConversation();
  const { loadThread } = useThread();

  const filteredConversations = searchQuery
    ? conversations.filter((c) =>
        c.getTitle().toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : conversations;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Conversations</h3>
      </div>

      <div className={styles.searchContainer}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.list}>
        {filteredConversations.map((conversation) => (
          <ConversationItem
            key={conversation.getId()}
            conversation={conversation}
            isActive={conversation.getId() === conversationId}
            isDeleting={false}
            onSelect={() => loadThread(conversation.getId())}
            onDelete={() => deleteConversation(conversation.getId())}
            onMouseEnter={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
