import React, { useRef, useEffect } from "react";
import styles from "../chat/ChatInput.module.css";
import { ProviderSelect } from "../controls/ProviderSelect";
import { ModelSelect } from "../controls/ModelSelect";
import CapabilityButtons from "../chat/CapabilityButtons";
import type { ModelOut, ProviderOut } from "../../types/api";

type InputBarViewProps = {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  onSend: () => void;

  // capability
  selectedCapability: "text" | "image" | "video";
  onSelectCapability: (cap: "text" | "image" | "video") => void;
  showText?: boolean;
  showImage?: boolean;
  showVideo?: boolean;

  // upload state/handlers
  uploadedImage: string;
  onClearImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelected: (file: File) => void;
  isDragging: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;

  // provider/model controls
  providers: ProviderOut[];
  selectedProvider: string;
  onChangeProvider: (value: string | null) => void;
  models: ModelOut[];
  selectedModel: string;
  isLoadingModels?: boolean;
  onSelectModel: (m: ModelOut) => void;
};

export default function InputBarView({
  inputValue,
  onInputChange,
  onKeyPress,
  placeholder,
  onSend,
  selectedCapability,
  onSelectCapability,
  showText = true,
  showImage = true,
  showVideo = true,
  uploadedImage,
  onClearImage,
  fileInputRef,
  onFileSelected,
  isDragging,
  onDrop,
  onDragOver,
  onDragLeave,
  providers,
  selectedProvider,
  onChangeProvider,
  models,
  selectedModel,
  isLoadingModels = false,
  onSelectModel,
}: InputBarViewProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to recalculate
      textarea.style.height = "auto";

      // Calculate new height based on scroll height
      const newHeight = Math.min(textarea.scrollHeight, 120); // Max height of ~6 lines
      textarea.style.height = `${newHeight}px`;

      // Add overflow when content exceeds max height
      textarea.style.overflowY = textarea.scrollHeight > 120 ? "auto" : "hidden";
    }
  }, [inputValue]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {uploadedImage && (
          <div className={styles.imagePreview}>
            <img src={uploadedImage} alt="Upload" />
            <button onClick={onClearImage} className={styles.clearImage} type="button">
              ×
            </button>
          </div>
        )}

        <div
          className={`${styles.inputRow} ${isDragging ? styles.dragging : ""}`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <textarea
            ref={textareaRef}
            className={styles.textInput}
            placeholder={placeholder}
            value={inputValue}
            onChange={onInputChange}
            onKeyPress={onKeyPress}
            rows={1}
            style={{ resize: "none" }}
          />
        </div>

        <div className={styles.actionsRow}>
          <div className={styles.leftActions}>
            <CapabilityButtons
              selected={selectedCapability}
              onSelect={onSelectCapability}
              showText={showText}
              showImage={showImage}
              showVideo={showVideo}
            />
            {selectedCapability === "image" && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] && onFileSelected(e.target.files[0])
                  }
                  style={{ display: "none" }}
                />
                <button
                  className={styles.addImageBtn}
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                  title="Add image"
                >
                  +
                </button>
              </>
            )}
          </div>

          <div className={styles.rightActions}>
            <ProviderSelect
              providers={providers}
              value={selectedProvider}
              onChange={(next) => onChangeProvider(next)}
            />
            <ModelSelect
              models={models}
              value={selectedModel}
              isLoading={isLoadingModels}
              onSelect={onSelectModel}
            />
            <button
              className={styles.sendBtn}
              onClick={() => onSend()}
              title="Send message"
              type="button"
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
