import Greeting from "../chat/Greeting";
import { useThreadStore, useExecStore, useSelectionsStore } from "../../common/stores";
import ThreadItemView from "./ThreadItemView";
import styles from "./ResultSurface.module.css";
import AssistantSkeleton from "../../common/components/AssistantSkeleton/AssistantSkeleton";

export default function ResultSurface() {
  const items = useThreadStore((s) => s.items);
  const isGenerating = useExecStore((s) => s.isGenerating);
  const capability = useSelectionsStore((s) => s.capability);
  const showLoader = isGenerating && (capability === "image" || capability === "video");

  return (
    <div className={styles.container}>
      {!items || items.length === 0 ? (
        <Greeting name="Kamil" />
      ) : (
        items.map((it) => <ThreadItemView key={it.id} item={it} />)
      )}
      {showLoader && <AssistantSkeleton />}
    </div>
  );
}
