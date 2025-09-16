import { useEffect, useState } from "react";
import { useAuth } from "../../lib/auth/context";
import { useThreadStore } from "../../stores/thread.store";
import { useThread } from "../../hooks/useThread";
import { useConversation } from "../../hooks/useConversation";
import ConversationHistory from "./ConversationHistory";
import { UserProfile } from "./UserProfile";
import styles from "./ConversationManager.module.css";

export function ConversationManager() {
  const { user } = useAuth();
  const conversationId = useThreadStore((s) => s.conversationId);
  const { clear } = useThreadStore();
  const { saveThread, loadThread } = useThread();
  const { conversations } = useConversation();
  const [isExpanded, setIsExpanded] = useState(false);

  // Restore persisted conversation on mount
  useEffect(() => {
    if (conversationId && !useThreadStore.getState().thread && conversations.length > 0) {
      const exists = conversations.some(c => c.getId() === conversationId);
      if (exists) {
        loadThread(conversationId);
      }
    }
  }, [conversationId, conversations, loadThread]); // Run when conversations load or conversationId changes

  useEffect(() => {
    if (!conversationId || !user) return;

    const interval = window.setInterval(() => {
      saveThread();
    }, 30000);

    return () => window.clearInterval(interval);
  }, [conversationId, user, saveThread]);

  if (!user) return null;

  return (
    <div
      className={styles.sidebar}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={styles.newChatContainer}>
        <button
          className={styles.newChatButton}
          onClick={clear}
          title="New Chat"
        >
          +
        </button>
        <span className={styles.newChatText}>New Chat</span>
      </div>
      <ConversationHistory />
      <UserProfile isExpanded={isExpanded} />
    </div>
  );
}
