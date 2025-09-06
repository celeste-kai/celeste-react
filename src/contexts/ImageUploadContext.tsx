import type { ReactNode } from "react";
import React, { createContext, useContext } from "react";
import useImageUpload from "../hooks/useImageUpload";
import { useSelections } from "../hooks/useSelections";

interface ImageUploadContextValue {
  uploadedImage: string;
  clearImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  selectFile: (file: File) => void;
  isDragging: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
}

const ImageUploadContext = createContext<ImageUploadContextValue | undefined>(
  undefined,
);

interface Props {
  children: ReactNode;
}

export function ImageUploadProvider({ children }: Props) {
  const { selectedCapability } = useSelections();

  const image = useImageUpload({
    enableDocumentDrop:
      selectedCapability === "image" || selectedCapability === "video",
  });

  const value: ImageUploadContextValue = {
    uploadedImage: image.uploadedImage,
    clearImage: image.clearImage,
    fileInputRef: image.fileInputRef as React.RefObject<HTMLInputElement>,
    selectFile: image.selectFile,
    isDragging: image.isDragging,
    onDrop: image.onDrop,
    onDragOver: image.onDragOver,
    onDragLeave: image.onDragLeave,
  };

  return (
    <ImageUploadContext.Provider value={value}>{children}</ImageUploadContext.Provider>
  );
}

export function useImageUploadContext() {
  const context = useContext(ImageUploadContext);
  if (context === undefined) {
    throw new Error("useImageUploadContext must be used within an ImageUploadProvider");
  }
  return context;
}
