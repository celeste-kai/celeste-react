import styles from "./Popup.module.css";
import Popup from "../../../common/components/Popup/Popup";

type AttachmentPopupProps = { onClose: () => void };

function AttachmentPopup({ onClose }: AttachmentPopupProps) {
  return (
    <Popup title="📎 Attachments" onClose={onClose}>
      <input className={styles.input} type="file" accept=".pdf,.txt,.png,.jpg,.jpeg" />
    </Popup>
  );
}

export default AttachmentPopup;
