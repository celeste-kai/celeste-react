import styles from "./ThreadItemView.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import ImagePart from "./parts/ImagePart";
import type { ContentPart, ThreadItem, Role } from "../../domain/thread";

function PartView({ part, role }: { part: ContentPart; role: Role }) {
  if (part.kind === "text") {
    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{part.content}</ReactMarkdown>;
  }
  if (part.kind === "image") {
    return <ImagePart {...part} role={role} />;
  }
  if (part.kind === "video") {
    const src = part.url || part.path;
    return src ? (
      <video src={src} controls playsInline style={{ maxWidth: "100%" }} />
    ) : null;
  }
  if (part.kind === "audio") {
    return part.data ? (
      <AudioPlayer
        src={part.data}
        showJumpControls={false}
        showDownloadProgress={false}
        showFilledProgress={true}
        autoPlayAfterSrcChange={false}
        customAdditionalControls={[]}
        layout="horizontal-reverse"
      />
    ) : null;
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
