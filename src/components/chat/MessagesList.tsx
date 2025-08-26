import React from 'react';
const LazyMarkdown = React.lazy(() => import('../common/LazyMarkdown'));
import styles from './MessagesList.module.css';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: number;
};

type MessagesListProps = {
  messages: ChatMessage[];
  isGenerating?: boolean;
};

export default function MessagesList({ messages, isGenerating = false }: MessagesListProps) {
  if (!messages || messages.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {messages.map((m) => {
        const isUser = m.role === 'user';
        return (
          <div
            key={m.id}
            className={`${styles.message} ${isUser ? styles.user : styles.assistant}`}
          >
            {!isUser && (
              <div className={styles.avatar} aria-hidden>
                <span
                  className={isGenerating && m === messages[messages.length - 1] ? styles.spin : ''}
                >
                  ✴
                </span>
              </div>
            )}
            <div className={styles.card}>
              <div className={styles.text}>
                <React.Suspense fallback={<span /> }>
                  <LazyMarkdown>{m.content}</LazyMarkdown>
                </React.Suspense>
              </div>
            </div>
          </div>
        );
      })}
      {isGenerating && (
        <div className={`${styles.message} ${styles.assistant}`}>
          <div className={styles.avatar} aria-hidden>
            <span className={styles.spin}>✴</span>
          </div>
          <div className={styles.card}>
            <div className={styles.text}> </div>
          </div>
        </div>
      )}
      {/* Spacer so content isn't hidden behind fixed input */}
      <div className={styles.bottomSpacer} />
    </div>
  );
}
