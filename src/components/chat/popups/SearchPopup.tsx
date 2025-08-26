import styles from "./Popup.module.css";
import Popup from "../../../common/components/Popup/Popup";

type SearchPopupProps = { onClose: () => void };

function SearchPopup({ onClose }: SearchPopupProps) {
  return (
    <Popup title="🔍 Search" onClose={onClose}>
      <input className={styles.input} type="text" placeholder="Search..." />
    </Popup>
  );
}

export default SearchPopup;
