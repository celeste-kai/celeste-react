import { useEffect } from "react";
import { useAuth } from "../../lib/auth/context";
import { useThreadStore } from "../../stores/thread.store";
import { useThread } from "../../hooks/useThread";
import ConversationHistory from "./ConversationHistory";
import { UserProfile } from "./UserProfile";
import styles from "./ConversationManager.module.css";

export function ConversationManager() {
  const { user } = useAuth();
  const conversationId = useThreadStore((s) => s.conversationId);
  const { saveThread } = useThread();

  useEffect(() => {
    if (!conversationId || !user) return;

    const interval = window.setInterval(() => {
      saveThread();
    }, 30000);

    return () => window.clearInterval(interval);
  }, [conversationId, user, saveThread]);

  if (!user) return null;

  return (
    <div className={styles.sidebar}>
      <UserProfile />
      <ConversationHistory />
    </div>
  );
}
