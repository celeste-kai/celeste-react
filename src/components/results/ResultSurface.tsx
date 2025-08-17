import React from 'react';
import Greeting from '../chat/Greeting';
import { useThreadStore } from '../../stores/thread';
import ThreadItemView from './ThreadItemView';
import styles from './ResultSurface.module.css';
import itemStyles from './ThreadItemView.module.css';
import { useExecStore } from '../../stores/exec';
import { useSelectionsStore } from '../../lib/store/selections';

export default function ResultSurface() {
  const items = useThreadStore((s) => s.items);
  const isGenerating = useExecStore((s) => s.isGenerating);
  const capability = useSelectionsStore((s) => s.capability);
  const showLoader = isGenerating && (capability === 'image' || capability === 'video');

  return (
    <div className={styles.container}>
      {!items || items.length === 0 ? (
        <Greeting name="Kamil" />
      ) : (
        items.map((it) => <ThreadItemView key={it.id} item={it} />)
      )}
      {showLoader && (
        <div className={`${itemStyles.item} ${itemStyles.assistant}`} aria-live="polite">
          <div className={itemStyles.avatar} aria-hidden>
            <span className={itemStyles.spin}>✴</span>
          </div>
          <div className={itemStyles.card}>
            <div className={itemStyles.text}> </div>
          </div>
        </div>
      )}
      <div className={styles.bottomSpacer} />
    </div>
  );
}
