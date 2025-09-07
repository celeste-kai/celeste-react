import type { ImagePart as ImagePartType, Role } from "../../../domain/types";
import styles from "./ImagePart.module.css";

interface ImagePartProps extends ImagePartType {
  role?: Role;
}

export default function ImagePart({
  url,
  role = "assistant",
}: ImagePartProps) {
  if (!url) return <div>Image</div>;

  const imageClass = role === "user" ? styles.userImage : styles.assistantImage;
  const altText = role === "user" ? "user input" : "generated";

  return <img src={url} alt={altText} className={imageClass} />;
}
