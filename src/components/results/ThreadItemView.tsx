import React from "react";
import styles from "./ThreadItemView.module.css";
import TextPart from "./parts/TextPart";
import ImagePart from "./parts/ImagePart";
import VideoPart from "./parts/VideoPart";
import type { ContentPart, ThreadItem, Role } from "../../domain/thread";

function PartView({ part, role }: { part: ContentPart; role: Role }) {
  if (part.kind === "text") {
    return <TextPart content={part.content} />;
  }
  if (part.kind === "image") {
    return <ImagePart {...part} role={role} />;
  }
  if (part.kind === "video") {
    return <VideoPart url={part.url} path={part.path} />;
  }
  return null;
}

export default function ThreadItemView({ item }: { item: ThreadItem }) {
  const sideClass = item.role === "user" ? styles.user : styles.assistant;
  const cardClass =
    item.role === "user" ? `${styles.card} ${styles.userCard}` : styles.card;
  const showAvatar = item.role !== "user";
  const firstPart = item.parts && item.parts.length > 0 ? item.parts[0] : undefined;
  const isPendingDraft =
    item.role === "assistant" &&
    firstPart &&
    (firstPart as ContentPart).kind === "text" &&
    !(firstPart as any).content;
  return (
    <div
      className={`${styles.item} ${sideClass}`}
      aria-live={isPendingDraft ? "polite" : undefined}
    >
      {showAvatar && (
        <div className={styles.avatar} aria-hidden>
          <span className={isPendingDraft ? styles.spin : undefined}>✴</span>
        </div>
      )}
      <div className={cardClass}>
        <div className={styles.text}>
          {item.parts.map((p, idx) => (
            <div key={idx}>
              <PartView part={p} role={item.role} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
