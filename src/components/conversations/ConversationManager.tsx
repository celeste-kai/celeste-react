import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useThreadStore } from "../../stores/thread/store";
import ConversationHistory from "./ConversationHistory";
import { UserProfile } from "./UserProfile";
import styles from "./ConversationManager.module.css";

export function ConversationManager() {
  const { user } = useAuth();
  const { currentConversationId, saveCurrentConversation } = useThreadStore();

  // Simple auto-save every 30 seconds if there's a conversation
  useEffect(() => {
    if (!currentConversationId || !user) return;

    const interval = window.setInterval(() => {
      saveCurrentConversation();
    }, 30000);

    return () => window.clearInterval(interval);
  }, [currentConversationId, user, saveCurrentConversation]);

  if (!user) return null;

  return (
    <div className={styles.sidebar}>
      <UserProfile />
      <ConversationHistory />
    </div>
  );
}
