import React from "react";
import styles from "../../../components/chat/popups/Popup.module.css";

type PopupProps = {
  title: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
};

export function Popup({ title, onClose, children }: PopupProps) {
  return (
    <div className={styles.popup} role="dialog" aria-modal="true">
      <h3 className={styles.title}>{title}</h3>
      <div>{children}</div>
      <button className={styles.button} type="button" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

export default Popup;
