import React from 'react';
import styles from './ThreadItemView.module.css';
import TextPart from './parts/TextPart';
import ImagePart from './parts/ImagePart';
import VideoPart from './parts/VideoPart';
import type { ContentPart, ThreadItem } from '../../domain/thread';

function PartView({ part }: { part: ContentPart }) {
  if (part.kind === 'text') {
    return <TextPart content={part.content} />;
  }
  if (part.kind === 'image') {
    return <ImagePart dataUrl={part.dataUrl} path={part.path} />;
  }
  if (part.kind === 'video') {
    return <VideoPart url={part.url} path={part.path} />;
  }
  return null;
}

export default function ThreadItemView({ item }: { item: ThreadItem }) {
  const sideClass = item.role === 'user' ? styles.user : styles.assistant;
  const cardClass = item.role === 'user' ? `${styles.card} ${styles.userCard}` : styles.card;
  const showAvatar = item.role !== 'user';
  return (
    <div className={`${styles.item} ${sideClass}`}>
      {showAvatar && (
        <div className={styles.avatar} aria-hidden>
          <span>✴</span>
        </div>
      )}
      <div className={cardClass}>
        <div className={styles.text}>
          {item.parts.map((p, idx) => (
            <div key={idx}>
              <PartView part={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
