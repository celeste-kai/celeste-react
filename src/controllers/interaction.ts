import { useCallback, useMemo } from "react";
import { useSelectionsStore } from "../lib/store/selections";
import { useTextController } from "./textController";
import { useImageController } from "./imageController";
import { useImageEditController } from "./imageEditController";
import { useVideoController } from "./videoController";

export function useInteraction() {
  const capability = useSelectionsStore((s) => s.capability);
  const imageMode = useSelectionsStore((s) => s.imageMode);

  const text = useTextController();
  const image = useImageController();
  const imageEdit = useImageEditController();
  const video = useVideoController();

  const submit = useCallback(
    (prompt: string, imageData?: string) => {
      if (capability === "text") {
        return text.execute(prompt);
      }
      if (capability === "image") {
        if (imageMode === "edit" && imageData) {
          return imageEdit.execute(prompt, imageData);
        }
        return image.execute(prompt);
      }
      return video.execute(prompt);
    },
    [capability, imageMode, image, imageEdit, text, video],
  );

  const isGenerating = useMemo(
    () =>
      text.isGenerating ||
      image.isGenerating ||
      imageEdit.isEditing ||
      video.isGenerating,
    [image.isGenerating, imageEdit.isEditing, text.isGenerating, video.isGenerating],
  );

  return { submit, isGenerating };
}
