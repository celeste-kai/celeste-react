import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import { fileToDataUrl } from "../../utils/image";

export function useImageUpload(opts?: {
  externalImage?: string | null;
  onHandled?: () => void;
}) {
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const externalImage = opts?.externalImage;
  const onHandled = opts?.onHandled;

  useEffect(() => {
    if (externalImage) {
      setUploadedImage(externalImage);
      onHandled?.();
    }
  }, [externalImage, onHandled]);

  const selectFile = useCallback(async (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const dataUrl = await fileToDataUrl(file);
      setUploadedImage(dataUrl);
    }
  }, []);

  const clearImage = useCallback(() => setUploadedImage(""), []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        void selectFile(file);
      }
    },
    [selectFile],
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  return {
    uploadedImage,
    isDragging,
    fileInputRef,
    selectFile,
    clearImage,
    onDrop,
    onDragOver,
    onDragLeave,
  } as const;
}

export default useImageUpload;
