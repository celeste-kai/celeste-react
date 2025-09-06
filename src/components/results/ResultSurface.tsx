import Greeting from "../chat/Greeting";
import { useThreadStore } from "../../stores/thread/store";
import ThreadItemView from "./ThreadItemView";
import styles from "./ResultSurface.module.css";

export default function ResultSurface() {
  const items = useThreadStore((s) => s.items);

  return (
    <div className={styles.container}>
      {!items || items.length === 0 ? (
        <Greeting name="Kamil" />
      ) : (
        items.map((it) => <ThreadItemView key={it.id} item={it} />)
      )}
    </div>
  );
}
