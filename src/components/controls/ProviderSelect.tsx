import { useMemo } from "react";
import { useDropdownMenu } from "../../common/hooks/useDropdownMenu";
import ProviderIcon from "../icons/ProviderIcon";
import { ALL_PROVIDERS_LABEL, CHEVRON, STAR } from "../../common/constants/strings";
import styles from "./ProviderSelect.module.css";
import type { ProviderOut } from "../../types/api";

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
  const { open, toggle, buttonRef, containerRef, flipUp, close } =
    useDropdownMenu("provider");

  const current = useMemo(
    () => providers.find((p) => p.id === value),
    [providers, value],
  );
  const currentId = current ? current.id : "celeste";
  const currentLabel = current?.label || ALL_PROVIDERS_LABEL;

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.button} ${compact ? styles.iconOnly : ""}`}
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="menu"
        title={currentLabel}
      >
        {!value ? (
          <span className={styles.celesteStar}>{STAR}</span>
        ) : (
          <ProviderIcon id={currentId} />
        )}
        {!compact && <span>{currentLabel}</span>}
        <span className={styles.chevron}>{CHEVRON}</span>
      </button>
      {open && (
        <div
          className={`${styles.menu} ${flipUp ? styles.menuUp : styles.menuDown}`}
          role="menu"
        >
          <button
            className={styles.item}
            onClick={() => {
              onChange(null);
              close();
            }}
          >
            <span className={styles.celesteStar}>{STAR}</span>
            <span>{ALL_PROVIDERS_LABEL}</span>
          </button>
          {providers.map((p) => (
            <button
              key={p.id}
              className={styles.item}
              onClick={() => {
                onChange(p.id);
                close();
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
