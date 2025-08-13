import styles from './Popup.module.css';

type SearchPopupProps = { onClose: () => void };

function SearchPopup({ onClose }: SearchPopupProps) {
  return (
    <div className={styles.popup}>
      <h3 className={styles.title}>🔍 Search</h3>
      <input className={styles.input} type="text" placeholder="Search..." />
      <button className={styles.button} type="button" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

export default SearchPopup;
