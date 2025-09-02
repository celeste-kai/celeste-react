import itemStyles from "../../../components/results/ThreadItemView.module.css";

export function AssistantSkeleton({ spinning = true }: { spinning?: boolean }) {
  return (
    <div className={`${itemStyles.item} ${itemStyles.assistant}`} aria-live="polite">
      <div className={itemStyles.avatar} aria-hidden>
        <span className={spinning ? itemStyles.spin : undefined}>✴</span>
      </div>
      <div className={itemStyles.card}>
        <div className={itemStyles.text}> </div>
      </div>
    </div>
  );
}

export default AssistantSkeleton;
