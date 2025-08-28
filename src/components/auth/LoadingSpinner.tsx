import styles from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "medium" | "large";
}

export default function LoadingSpinner({
  message = "Loading...",
  size = "medium",
}: LoadingSpinnerProps) {
  return (
    <div className={styles.spinnerContainer}>
      <div
        className={`${styles.spinner} ${styles[`spinner${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}
      >
        <div className={styles.spinnerCircle}></div>
        <div className={styles.spinnerCircle}></div>
        <div className={styles.spinnerCircle}></div>
      </div>
      {message && <p className={styles.spinnerMessage}>{message}</p>}
    </div>
  );
}
