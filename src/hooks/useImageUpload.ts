import { useCallback, useEffect, useRef, useState } from "react";
import type { DragEvent } from "react";
import type { ImageArtifact } from "../core/types";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

export function useImageUpload(enableDocumentDrop = false) {
  const [uploadedImage, setUploadedImage] = useState<ImageArtifact | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/") || file.size > MAX_FILE_SIZE) return;
    const dataUrl = await fileToDataUrl(file);
    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    setUploadedImage({
      data: base64Data,
      metadata: {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      }
    });
  }, []);

  const clearImage = useCallback(() => {
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) selectFile(file);
    },
    [selectFile]
  );

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (!enableDocumentDrop) return;

    const handleDrop = (e: globalThis.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer?.files[0];
      if (file?.type.startsWith("image/")) selectFile(file);
    };

    const handleDragOver = (e: globalThis.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDrop);
    return () => {
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDrop);
    };
  }, [enableDocumentDrop, selectFile]);

  return {
    uploadedImage,
    isDragging,
    fileInputRef,
    selectFile,
    clearImage,
    onDrop,
    onDragOver,
    onDragLeave,
  };
}
