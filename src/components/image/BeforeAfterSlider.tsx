import { useState } from "react";
import styles from "./BeforeAfterSlider.module.css";

type Props = {
  beforeImage: string;
  afterImage: string;
};

export function BeforeAfterSlider({ beforeImage, afterImage }: Props) {
  const [sliderPosition, setSliderPosition] = useState(15); // Start at 15% to showcase the edit

  return (
    <div className={styles.container}>
      {/* Before/original image (full, but clipped on right) */}
      <img src={beforeImage} alt="Before" />

      {/* After/edited image (clipped on left) */}
      <div
        className={styles.afterWrapper}
        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
      >
        <img src={afterImage} alt="After" />
      </div>

      {/* Vertical slider line */}
      <div className={styles.sliderLine} style={{ left: `${sliderPosition}%` }} />

      {/* Slider handle */}
      <div
        className={styles.sliderHandleWrapper}
        style={{ left: `${sliderPosition}%` }}
      >
        <div className={styles.sliderHandleVisual} />
      </div>

      {/* Invisible range input for interaction */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={(e) => setSliderPosition(Number(e.target.value))}
        className={styles.sliderInput}
      />
    </div>
  );
}
