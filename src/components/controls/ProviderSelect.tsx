import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styles from './ProviderSelect.module.css';
import { useUiStore } from '../../lib/store/ui';
import ProviderIcon from '../icons/ProviderIcon';
import type { ProviderOut } from '../../types/api';

export function ProviderSelect({
  providers,
  value,
  onChange,
  compact = true,
}: {
  providers: ProviderOut[];
  value: string;
  onChange: (next: string | null) => void;
  compact?: boolean;
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
    setFlipUp(spaceBelow < 200); // if less than 200px, open upwards
  }, [open]);

  // Close if another menu opens
  useEffect(() => {
    if (openMenu !== 'provider' && open) {
      setOpen(false);
    }
  }, [openMenu, open]);

  const current = useMemo(() => providers.find((p) => p.id === value), [providers, value]);
  const currentId = current ? current.id : 'celeste';
  const currentLabel = current?.label || 'All providers';

  return (
    <div className={styles.container}>
      <button
        ref={btnRef}
        type="button"
        className={`${styles.button} ${compact ? styles.iconOnly : ''}`}
        onClick={() => {
          const next = !open;
          setOpen(next);
          setOpenMenu(next ? 'provider' : null);
        }}
        aria-expanded={open}
        aria-haspopup="menu"
        title={currentLabel}
      >
        {!value ? <span className={styles.celesteStar}>✴</span> : <ProviderIcon id={currentId} />}
        {!compact && <span>{currentLabel}</span>}
        <span className={styles.chevron}>⌄</span>
      </button>
      {open && (
        <div className={`${styles.menu} ${flipUp ? styles.menuUp : styles.menuDown}`} role="menu">
          <button
            className={styles.item}
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
          >
            <span className={styles.celesteStar}>✴</span>
            <span>All providers</span>
          </button>
          {providers.map((p) => (
            <button
              key={p.id}
              className={styles.item}
              onClick={() => {
                onChange(p.id);
                setOpen(false);
              }}
            >
              <ProviderIcon id={p.id} />
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
