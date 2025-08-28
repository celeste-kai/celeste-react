import React, { useMemo } from "react";
import useDropdownMenu from "../../common/hooks/useDropdownMenu";
import styles from "./ProviderSelect.module.css";
import type { ModelOut } from "../../types/api";
import {
  CHEVRON,
  LOADING_LABEL,
  SELECT_MODEL_LABEL,
} from "../../common/constants/strings";

export function ModelSelect({
  models,
  value,
  isLoading = false,
  onSelect,
}: {
  models: ModelOut[];
  value: string;
  isLoading?: boolean;
  onSelect: (m: ModelOut) => void;
}) {
  const { open, toggle, buttonRef, containerRef, flipUp, close } =
    useDropdownMenu("model");

  const current = useMemo(() => models.find((m) => m.id === value), [models, value]);
  const currentLabel = isLoading
    ? LOADING_LABEL
    : current?.display_name || current?.id || SELECT_MODEL_LABEL;

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.button}
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="menu"
        title={currentLabel}
      >
        <span>{currentLabel}</span>
        <span className={styles.chevron}>{CHEVRON}</span>
      </button>
      {open && (
        <div
          className={`${styles.menu} ${flipUp ? styles.menuUp : styles.menuDown}`}
          role="menu"
        >
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
                onSelect(m);
                close();
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
