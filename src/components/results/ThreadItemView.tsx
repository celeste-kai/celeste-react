import styles from "./ThreadItemView.module.css";
import Part from "./parts/Part";
import type { ContentPart, Role } from "../../domain/types";

interface ThreadItem {
  id: string;
  role: Role;
  parts: ContentPart[];
}

export default function ThreadItemView({ item }: { item: ThreadItem }) {
  const isPending =
    item.role === "assistant" &&
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
        <div
          className={`${styles.parts} ${item.role === "user" ? styles.userParts : styles.assistantParts}`}
        >
          {item.parts.map((p, idx) => (
            <Part key={idx} part={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
