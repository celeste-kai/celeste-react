import React, { useState, useRef, useEffect } from "react";
import styles from "./SimpleDropdown.module.css";

interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface SimpleDropdownProps {
  items: DropdownItem[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

export function SimpleDropdown({
  items,
  value,
  onChange,
  placeholder = "Select...",
  icon,
}: SimpleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = items.find((item) => item.id === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {icon || selected?.icon}
        <span className={styles.label}>{selected?.label || placeholder}</span>
        <span className={styles.chevron}>▾</span>
      </button>

      {isOpen && (
        <div className={styles.menu}>
          {items.map((item) => (
            <button
              key={item.id}
              className={`${styles.item} ${item.id === value ? styles.selected : ""}`}
              onClick={() => {
                onChange(item.id === "all" ? null : item.id);
                setIsOpen(false);
              }}
              type="button"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
