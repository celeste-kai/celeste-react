import styles from './Greeting.module.css';

type GreetingProps = { name: string };

function Greeting({ name }: GreetingProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.text}>
        <span className={styles.icon}>✴</span>
        <span>Bonjour {name}</span>
      </h1>
    </div>
  );
}

export default Greeting;
