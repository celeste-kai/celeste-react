import styles from './Popup.module.css';

type SettingsPopupProps = { onClose: () => void };

function SettingsPopup({ onClose }: SettingsPopupProps) {
  return (
    <div className={styles.popup}>
      <h3 className={styles.title}>⚙️ Settings</h3>
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
        <input className={styles.input} type="number" min="100" max="4000" defaultValue="1000" />
      </div>
      <button className={styles.button} type="button" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

export default SettingsPopup;
