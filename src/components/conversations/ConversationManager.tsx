import { useState, useEffect } from "react";
import { ConversationHistory } from "./ConversationHistory";
import { UserProfile } from "./UserProfile";
import { useThreadStore } from "../../stores/thread/store";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./ConversationManager.module.css";

interface ConversationManagerProps {
  className?: string;
}

export function ConversationManager({ className }: ConversationManagerProps) {
  const { user, signInWithGoogle } = useAuth();
  const {
    currentConversationId,
    createNewConversation,
    loadMostRecentConversation,
    saveCurrentConversation,
    isSaving,
    error,
  } = useThreadStore();

  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load most recent conversation on app initialization
  useEffect(() => {
    if (user && !currentConversationId) {
      loadMostRecentConversation().catch((_error) => {
        // Warning: Failed to load recent conversation on init
      });
    }
  }, [user, currentConversationId, loadMostRecentConversation]);

  // Auto-save current conversation periodically
  useEffect(() => {
    if (!currentConversationId || !user) return;

    const autoSaveInterval = window.setInterval(async () => {
      try {
        await saveCurrentConversation();
        setLastSaved(new Date());
      } catch {
        // Warning: Auto-save failed
      }
    }, 30000); // Auto-save every 30 seconds

    return () => window.clearInterval(autoSaveInterval);
  }, [currentConversationId, user, saveCurrentConversation]);

  const handleNewConversation = async () => {
    try {
      await createNewConversation();
    } catch {
      // Error: Failed to create new conversation
    }
  };

  if (!user) {
    return (
      <div className={`${styles.sidebar} ${className || ""}`}>
        <div className={styles.loginPrompt}>
          <h2>Welcome to Celeste</h2>
          <p>Sign in to save and manage your AI conversations</p>
          <button className={styles.signInButton} onClick={signInWithGoogle}>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.sidebar} ${className || ""}`}>
      {/* New Conversation Button */}
      <div className={styles.topSection}>
        <button
          className={styles.newConversationButton}
          onClick={handleNewConversation}
          disabled={isSaving}
        >
          <div className={styles.iconContainer}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14m-7-7h14" />
            </svg>
          </div>
          <span className={styles.buttonText}>New conversation</span>
        </button>

        {/* Save Status - Compact */}
        {currentConversationId && (
          <div className={styles.saveIndicator}>
            {isSaving && (
              <span className={styles.saving}>
                <span className={styles.spinner} />
                Saving...
              </span>
            )}
            {!isSaving && lastSaved && <span className={styles.saved}>Saved</span>}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Conversation History */}
      <div className={styles.conversationsSection}>
        <ConversationHistory
          onSelectConversation={(_id) => {
            // TODO: Implement conversation selection logic
          }}
          showNewButton={false} // We handle the new button at the top
          className={styles.conversations}
        />
      </div>

      {/* User Profile */}
      <UserProfile />
    </div>
  );
}
