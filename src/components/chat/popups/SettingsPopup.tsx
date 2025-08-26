import styles from "./Popup.module.css";
import Popup from "../../../common/components/Popup/Popup";

type SettingsPopupProps = { onClose: () => void };

function SettingsPopup({ onClose }: SettingsPopupProps) {
  return (
    <Popup title="⚙️ Settings" onClose={onClose}>
      <div className={styles.settingItem}>
        <label>Temperature: </label>
        <input
          className={styles.input}
          type="range"
          min="0"
          max="1"
          step="0.1"
          defaultValue="0.7"
        />
      </div>
      <div className={styles.settingItem}>
        <label>Max Tokens: </label>
        <input
          className={styles.input}
          type="number"
          min="100"
          max="4000"
          defaultValue="1000"
        />
      </div>
    </Popup>
  );
}

export default SettingsPopup;
