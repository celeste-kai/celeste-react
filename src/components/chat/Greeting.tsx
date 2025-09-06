import styles from "./Greeting.module.css";

export default function Greeting({ name }: { name: string }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.text}>
        <span className={styles.icon}>✴</span>
        <span>Hello, {name}</span>
      </h1>
    </div>
  );
}
