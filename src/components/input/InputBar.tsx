import React, { useEffect, useRef } from "react";
import styles from "../chat/ChatInput.module.css";
import { ProviderSelect } from "../controls/ProviderSelect";
import { ModelSelect } from "../controls/ModelSelect";
import CapabilityButtons from "../chat/CapabilityButtons";
import { useSelectionsStore } from "../../stores/selections";
import { useInputContext } from "../../contexts/InputContext";
import { useImageUploadContext } from "../../contexts/ImageUploadContext";
import { useModelSelectionContext } from "../../contexts/ModelSelectionContext";

export default function InputBar() {
  const selectModelFromCatalog = useSelectionsStore((s) => s.selectModelFromCatalog);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get values from contexts
  const {
    inputValue,
    handleInputChange,
    handleKeyPress,
    handleSend,
    selectedCapability,
    setSelectedCapability,
    imageMode: _imageMode,
    setImageMode,
  } = useInputContext();

  const {
    uploadedImage,
    clearImage,
    fileInputRef,
    selectFile,
    isDragging,
    onDrop,
    onDragOver,
    onDragLeave,
  } = useImageUploadContext();

  const {
    models,
    providers,
    isLoadingModels,
    showText,
    showImage,
    showVideo,
    showAudio,
    selectedModelValue,
    providerFilter,
    setProviderFilter,
  } = useModelSelectionContext();

  useEffect(() => {
    if (selectedCapability === "image") {
      setImageMode(uploadedImage ? "edit" : "generate");
    }
  }, [uploadedImage, selectedCapability, setImageMode]);

  const placeholder = (() => {
    if (selectedCapability === "image" && uploadedImage) {
      return "Describe how you want to edit this image...";
    }
    if (selectedCapability === "video" && uploadedImage) {
      return "Describe the video you want to create from this image...";
    }
    if (selectedCapability === "audio") {
      return "Enter text to convert to speech...";
    }
    return "Type a message...";
  })();

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 120);
      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY = textarea.scrollHeight > 120 ? "auto" : "hidden";
    }
  }, [inputValue]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {uploadedImage && (
          <div className={styles.imagePreview}>
            <img src={uploadedImage} alt="Upload" />
            <button onClick={clearImage} className={styles.clearImage} type="button">
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
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            rows={1}
            style={{ resize: "none" }}
          />
        </div>

        <div className={styles.actionsRow}>
          <div className={styles.leftActions}>
            <CapabilityButtons
              selected={selectedCapability}
              onSelect={setSelectedCapability}
              showText={showText}
              showImage={showImage}
              showVideo={showVideo}
              showAudio={showAudio}
            />
            {(selectedCapability === "image" || selectedCapability === "video") && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && selectFile(e.target.files[0])}
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
              value={providerFilter || ""}
              onChange={setProviderFilter}
            />
            <ModelSelect
              models={models}
              value={selectedModelValue || ""}
              isLoading={isLoadingModels}
              onSelect={selectModelFromCatalog}
            />
            <button
              className={styles.sendBtn}
              onClick={handleSend}
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
