import styles from "./ThreadItemView.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import ImagePart from "./parts/ImagePart";
import type { ContentPart, Role } from "../../domain/types";

interface ThreadItem {
  id: string;
  role: Role;
  parts: ContentPart[];
}

function PartView({ part, role }: { part: ContentPart; role: Role }) {
  switch (part.kind) {
    case "text":
      return <ReactMarkdown remarkPlugins={[remarkGfm]}>{part.content}</ReactMarkdown>;
    case "image":
      return <ImagePart {...part} role={role} />;
    case "video":
      return part.url || part.path ? (
        <video src={part.url || part.path} controls playsInline style={{ maxWidth: "100%" }} />
      ) : null;
    case "audio":
      return part.url ? <AudioPlayer src={part.url} showJumpControls={false} /> : null;
    default:
      return null;
  }
}

export default function ThreadItemView({ item }: { item: ThreadItem }) {
  const isPending = item.role === "assistant" &&
    item.parts[0]?.kind === "text" &&
    !item.parts[0].content;

  return (
    <div className={`${styles.item} ${styles[item.role]}`}>
      {item.role === "assistant" && (
        <div className={styles.avatar}>
          <span className={isPending ? styles.spin : undefined}>✴</span>
        </div>
      )}
      <div className={`${styles.card} ${item.role === "user" ? styles.userCard : ""}`}>
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
