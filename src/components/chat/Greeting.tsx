import styles from "./Greeting.module.css";
import { GREETING_PREFIX, STAR } from "../../common/constants/strings";

type GreetingProps = { name: string };

function Greeting({ name }: GreetingProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.text}>
        <span className={styles.icon}>{STAR}</span>
        <span>
          {GREETING_PREFIX} {name}
        </span>
      </h1>
    </div>
  );
}

export default Greeting;
