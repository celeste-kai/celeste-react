import Greeting from "../chat/Greeting";
import { useThreadStore } from "../../stores/thread.store";
import ThreadItemView from "./ThreadItemView";
import styles from "./ResultSurface.module.css";

export default function ResultSurface() {
  const thread = useThreadStore((s) => s.thread);
  const messages = thread?.getMessages() || [];

  return (
    <div className={styles.container}>
      {messages.length === 0 ? (
        <Greeting name="Kamil" />
      ) : (
        messages.map((msg) => (
          <ThreadItemView
            key={msg.getId()}
            item={{
              id: msg.getId(),
              role: msg.role,
              parts: msg.getParts()
            }}
          />
        ))
      )}
    </div>
  );
}
