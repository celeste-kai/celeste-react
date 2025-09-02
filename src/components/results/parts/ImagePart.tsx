import { BeforeAfterSlider } from "../../image/BeforeAfterSlider";
import type { ImagePart as ImagePartType, Role } from "../../../domain/thread";
import styles from "./ImagePart.module.css";

interface ImagePartProps extends ImagePartType {
  role?: Role;
}

export default function ImagePart({
  dataUrl,
  path,
  originalImage,
  role = "assistant",
}: ImagePartProps) {
  // If this is an edited image with original, show before/after slider
  if (dataUrl && originalImage?.dataUrl) {
    return (
      <BeforeAfterSlider beforeImage={originalImage.dataUrl} afterImage={dataUrl} />
    );
  }

  // Regular image display
  if (dataUrl) {
    const imageClass = role === "user" ? styles.userImage : styles.assistantImage;
    const altText = role === "user" ? "user input" : "generated";
    return <img src={dataUrl} alt={altText} className={imageClass} />;
  }
  if (path) {
    return (
      <a href={path} target="_blank" rel="noreferrer">
        View image
      </a>
    );
  }
  return <div>Image</div>;
}
