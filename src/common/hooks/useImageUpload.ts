import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import { fileToDataUrl } from "../../utils/image";

// Supported image file extensions for security validation
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

// Validate file type and size
function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check MIME type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }

  // Check file extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return { valid: false, error: 'Unsupported image format' };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'Image file too large (max 10MB)' };
  }

  return { valid: true };
}

export function useImageUpload(opts?: {
  externalImage?: string | null;
  onHandled?: () => void;
}) {
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const externalImage = opts?.externalImage;

  // Memoize onHandled to prevent unnecessary re-renders
  const onHandled = useCallback(() => {
    opts?.onHandled?.();
  }, [opts]);

  useEffect(() => {
    if (externalImage) {
      setUploadedImage(externalImage);
      setError(null);
      onHandled();
    }
  }, [externalImage, onHandled]);

  // Cleanup function to revoke object URLs and prevent memory leaks
  const cleanupImage = useCallback((imageUrl: string) => {
    if (imageUrl && imageUrl.startsWith('data:')) {
      // Data URLs don't need cleanup, but we clear the state
      return;
    }
    if (imageUrl && imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (uploadedImage) {
        cleanupImage(uploadedImage);
      }
    };
  }, [uploadedImage, cleanupImage]);

  const selectFile = useCallback(async (file: File) => {
    setError(null);

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    try {
      // Clean up previous image
      if (uploadedImage) {
        cleanupImage(uploadedImage);
      }

      const dataUrl = await fileToDataUrl(file);
      setUploadedImage(dataUrl);

      // Reset file input after successful processing to allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      setError('Failed to process image. Please try again.');
    }
  }, [uploadedImage, cleanupImage]);

  const clearImage = useCallback(() => {
    if (uploadedImage) {
      cleanupImage(uploadedImage);
    }
    setUploadedImage("");
    setError(null);

    // Reset file input to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [uploadedImage, cleanupImage]);

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
    error,
    fileInputRef,
    selectFile,
    clearImage,
    onDrop,
    onDragOver,
    onDragLeave,
  } as const;
}

export default useImageUpload;
