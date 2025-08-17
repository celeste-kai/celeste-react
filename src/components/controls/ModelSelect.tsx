import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useUiStore } from '../../lib/store/ui';
import styles from './ProviderSelect.module.css';
import { useSelectionsStore } from '../../lib/store/selections';
import type { ModelOut } from '../../types/api';

export function ModelSelect({
  models,
  value,
  isLoading = false,
}: {
  models: ModelOut[];
  value: string;
  isLoading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const openMenu = useUiStore((s) => s.openMenu);
  const setOpenMenu = useUiStore((s) => s.setOpenMenu);
  const [flipUp, setFlipUp] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }
    const btn = btnRef.current;
    if (!btn) {
      return;
    }
    const rect = btn.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setFlipUp(spaceBelow < 200);
  }, [open]);

  // Close if another menu opens
  useEffect(() => {
    if (openMenu !== 'model' && open) {
      setOpen(false);
    }
  }, [openMenu, open]);

  const current = useMemo(() => models.find((m) => m.id === value), [models, value]);
  const currentLabel = isLoading
    ? 'Loading…'
    : current?.display_name || current?.id || 'Select model';

  return (
    <div className={styles.container}>
      <button
        ref={btnRef}
        type="button"
        className={styles.button}
        onClick={() => {
          const next = !open;
          setOpen(next);
          setOpenMenu(next ? 'model' : null);
        }}
        aria-expanded={open}
        aria-haspopup="menu"
        title={currentLabel}
      >
        <span>{currentLabel}</span>
        <span className={styles.chevron}>⌄</span>
      </button>
      {open && (
        <div className={`${styles.menu} ${flipUp ? styles.menuUp : styles.menuDown}`} role="menu">
          {models.length === 0 && (
            <div className={styles.item} aria-disabled>
              No models
            </div>
          )}
          {models.map((m) => (
            <button
              key={m.id}
              className={styles.item}
              onClick={() => {
                // Lock provider to the model's provider and set model id in the store
                useSelectionsStore.getState().selectModelFromCatalog(m);
                setOpen(false);
              }}
            >
              <span>{m.display_name || m.id}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ModelSelect;
