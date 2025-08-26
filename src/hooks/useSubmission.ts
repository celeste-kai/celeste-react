import { useCallback } from "react";
import { useInteraction } from "../controllers/interaction";
import type { ImageMode } from "../lib/capability";

interface UseSubmissionProps {
  selectedCapability: "text" | "image" | "video";
  imageMode?: ImageMode;
  uploadedImage?: string;
  onClearImage?: () => void;
}

export function useSubmission({
  selectedCapability,
  imageMode,
  uploadedImage,
  onClearImage,
}: UseSubmissionProps) {
  const { submit: interactionSubmit } = useInteraction();

  const submit = useCallback(
    (prompt: string) => {
      // Handle image editing case
      if (selectedCapability === "image" && imageMode === "edit" && uploadedImage) {
        interactionSubmit(prompt, uploadedImage);
        onClearImage?.();
        return;
      }

      // Handle all other cases (text, image generation, video)
      interactionSubmit(prompt);
    },
    [selectedCapability, imageMode, uploadedImage, interactionSubmit, onClearImage],
  );

  return { submit };
}
