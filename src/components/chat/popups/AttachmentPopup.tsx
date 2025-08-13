import styles from './Popup.module.css';

type AttachmentPopupProps = { onClose: () => void };

function AttachmentPopup({ onClose }: AttachmentPopupProps) {
  return (
    <div className={styles.popup}>
      <h3 className={styles.title}>📎 Attachments</h3>
      <input className={styles.input} type="file" accept=".pdf,.txt,.png,.jpg,.jpeg" />
      <button className={styles.button} type="button" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

export default AttachmentPopup;
