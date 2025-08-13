import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './MessagesList.module.css';
import type { ChatMessage } from '../../hooks/useChat';

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
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
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
