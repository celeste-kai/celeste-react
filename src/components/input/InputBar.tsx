import React, { useState, useEffect, useRef } from 'react';
import styles from '../chat/ChatInput.module.css';
import { ProviderSelect } from '../controls/ProviderSelect';
import { ModelSelect } from '../controls/ModelSelect';
import CapabilityButtons from '../chat/CapabilityButtons';
import { fileToDataUrl } from '../../utils/image';
import type { ModelOut, ProviderOut } from '../../types/api';
import type { ImageMode } from '../../lib/capability';

type Props = {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSend: (prompt: string, imageData?: string) => void;
  onRefresh: () => void;
  selectedModel: string;
  models?: ModelOut[];
  isLoadingModels?: boolean;
  selectedCapability: 'text' | 'image' | 'video';
  onSelectCapability: (cap: 'text' | 'image' | 'video') => void;
  providers?: ProviderOut[];
  selectedProvider: string;
  onChangeProvider: (value: string | null) => void;
  imageMode?: ImageMode;
  onImageModeChange?: (mode: ImageMode) => void;
  showText?: boolean;
  showImage?: boolean;
  showVideo?: boolean;
  externalImage?: string | null;
  onExternalImageHandled?: () => void;
};

export default function InputBar({
  inputValue,
  onInputChange,
  onKeyPress,
  onSend,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRefresh,
  selectedModel,
  models = [],
  isLoadingModels = false,
  selectedCapability,
  onSelectCapability,
  providers = [],
  selectedProvider,
  onChangeProvider,
  imageMode = 'generate',
  onImageModeChange,
  showText = true,
  showImage = true,
  showVideo = true,
  externalImage,
  onExternalImageHandled,
}: Props) {
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle external image from global drag-drop
  useEffect(() => {
    if (externalImage && selectedCapability === 'image') {
      setUploadedImage(externalImage);
      onExternalImageHandled?.();
    }
  }, [externalImage, selectedCapability, onExternalImageHandled]);

  // Auto-switch mode based on image upload
  useEffect(() => {
    if (selectedCapability === 'image' && onImageModeChange) {
      onImageModeChange(uploadedImage ? 'edit' : 'generate');
    }
  }, [uploadedImage, selectedCapability, onImageModeChange]);

  const handleImageSelect = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const dataUrl = await fileToDataUrl(file);
      setUploadedImage(dataUrl);
    }
  };

  const handleImageClear = () => {
    setUploadedImage('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (selectedCapability === 'image') {
      const file = e.dataTransfer.files[0];
      handleImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedCapability === 'image') {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleSend = () => {
    if (selectedCapability === 'image' && imageMode === 'edit' && uploadedImage) {
      onSend(inputValue, uploadedImage);
      setUploadedImage(''); // Clear the image after sending
    } else {
      onSend(inputValue);
    }
  };

  const placeholder =
    selectedCapability === 'image'
      ? imageMode === 'edit'
        ? 'Describe the edits to apply...'
        : 'Describe the image to generate or drop an image'
      : selectedCapability === 'video'
        ? 'Describe the video to generate...'
        : 'How can I help you?';
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {uploadedImage && (
          <div className={styles.imagePreview}>
            <img src={uploadedImage} alt="Upload" />
            <button onClick={handleImageClear} className={styles.clearImage} type="button">
              ×
            </button>
          </div>
        )}

        <div
          className={`${styles.inputRow} ${isDragging ? styles.dragging : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="text"
            className={styles.textInput}
            placeholder={placeholder}
            value={inputValue}
            onChange={onInputChange}
            onKeyPress={onKeyPress}
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
            {selectedCapability === 'image' && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
                  style={{ display: 'none' }}
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
            <ModelSelect models={models} value={selectedModel} isLoading={isLoadingModels} />
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
