import type { ImageMode } from "../../lib/capability";
import {
  PLACEHOLDER_DEFAULT,
  PLACEHOLDER_IMAGE_EDIT,
  PLACEHOLDER_IMAGE_GENERATE,
  PLACEHOLDER_VIDEO,
} from "../constants/strings";

export function usePromptPlaceholder({
  capability,
  imageMode,
  hasImage,
}: {
  capability: "text" | "image" | "video";
  imageMode?: ImageMode;
  hasImage?: boolean;
}): string {
  if (capability === "image") {
    const isEdit = imageMode === "edit" || hasImage;
    return isEdit ? PLACEHOLDER_IMAGE_EDIT : PLACEHOLDER_IMAGE_GENERATE;
  }
  if (capability === "video") {
    return PLACEHOLDER_VIDEO;
  }
  return PLACEHOLDER_DEFAULT;
}

export default usePromptPlaceholder;
