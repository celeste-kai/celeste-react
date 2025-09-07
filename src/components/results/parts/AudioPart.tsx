import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import styles from "./AudioPart.module.css";

interface AudioPartProps {
  src: string;
}

export default function AudioPart({ src }: AudioPartProps) {
  return (
    <div className={styles.audioContainer}>
      <AudioPlayer
        src={src}
        showJumpControls={false}
        customAdditionalControls={[]}
        layout="horizontal-reverse"
        className={styles.player}
      />
    </div>
  );
}
