import { useCallback, useEffect, useState } from "react";
import { fileToDataUrl } from "../utils/image";
import type { CapabilityId } from "../lib/store/selections";

interface UseDragAndDropProps {
  onImageDrop?: (dataUrl: string) => void;
  onCapabilityChange?: (capability: CapabilityId) => void;
}

interface UseDragAndDropReturn {
  draggedImage: string | null;
  clearDraggedImage: () => void;
}

export function useDragAndDrop({
  onImageDrop,
  onCapabilityChange,
}: UseDragAndDropProps = {}): UseDragAndDropReturn {
  const [draggedImage, setDraggedImage] = useState<string | null>(null);

  const clearDraggedImage = useCallback(() => {
    setDraggedImage(null);
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const file = e.dataTransfer?.files[0];
      if (file && file.type.startsWith("image/")) {
        // Auto-switch to image capability if callback provided
        onCapabilityChange?.("image");

        // Convert to data URL using utility
        const dataUrl = await fileToDataUrl(file);
        setDraggedImage(dataUrl);
        onImageDrop?.(dataUrl);
      }
    },
    [onImageDrop, onCapabilityChange],
  );

  useEffect(() => {
    // Add listeners to the entire document
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDrop);
    };
  }, [handleDragOver, handleDrop]);

  return {
    draggedImage,
    clearDraggedImage,
  };
}
