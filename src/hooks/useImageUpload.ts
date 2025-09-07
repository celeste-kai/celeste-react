import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

export function useImageUpload(enableDocumentDrop = false) {
  const [uploadedImage, setUploadedImage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/") || file.size > MAX_FILE_SIZE) return;
    setUploadedImage(await fileToDataUrl(file));
  }, []);

  const clearImage = useCallback(() => {
    setUploadedImage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) selectFile(file);
    },
    [selectFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (!enableDocumentDrop) return;

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer?.files[0];
      if (file?.type.startsWith("image/")) selectFile(file);
    };

    const handleDragOver = (e: DragEvent) => {
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

export default useImageUpload;
