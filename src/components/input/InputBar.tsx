import React, { useEffect } from "react";
import InputBarView from "./InputBarView";
import { usePromptPlaceholder } from "../../common/hooks/usePromptPlaceholder";
import { useSelectionsStore } from "../../lib/store/selections";
import type { ModelOut, ProviderOut } from "../../types/api";
import type { ImageMode } from "../../lib/capability";

type Props = {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSend: (prompt: string) => void;
  selectedModel: string;
  models?: ModelOut[];
  isLoadingModels?: boolean;
  selectedCapability: "text" | "image" | "video";
  onSelectCapability: (cap: "text" | "image" | "video") => void;
  providers?: ProviderOut[];
  selectedProvider: string;
  onChangeProvider: (value: string | null) => void;
  imageMode?: ImageMode;
  onImageModeChange?: (mode: ImageMode) => void;
  showText?: boolean;
  showImage?: boolean;
  showVideo?: boolean;
  // Image upload props passed from App
  uploadedImage: string;
  onClearImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileSelected: (file: File) => void;
  isDragging: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
};

export default function InputBar({
  inputValue,
  onInputChange,
  onKeyPress,
  onSend,
  selectedModel,
  models = [],
  isLoadingModels = false,
  selectedCapability,
  onSelectCapability,
  providers = [],
  selectedProvider,
  onChangeProvider,
  imageMode = "generate",
  onImageModeChange,
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
}: Props) {
  useEffect(() => {
    if (selectedCapability === "image" && onImageModeChange) {
      onImageModeChange(uploadedImage ? "edit" : "generate");
    }
  }, [uploadedImage, selectedCapability, onImageModeChange]);

  const placeholder = usePromptPlaceholder({
    capability: selectedCapability,
    imageMode,
    hasImage: !!uploadedImage,
  });

  const handleSend = () => {
    onSend(inputValue);
  };

  return (
    <InputBarView
      inputValue={inputValue}
      onInputChange={onInputChange}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      onSend={handleSend}
      selectedCapability={selectedCapability}
      onSelectCapability={onSelectCapability}
      showText={showText}
      showImage={showImage}
      showVideo={showVideo}
      uploadedImage={uploadedImage}
      onClearImage={onClearImage}
      fileInputRef={fileInputRef}
      onFileSelected={onFileSelected}
      isDragging={isDragging}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      providers={providers || []}
      selectedProvider={selectedProvider}
      onChangeProvider={onChangeProvider}
      models={models || []}
      selectedModel={selectedModel}
      isLoadingModels={isLoadingModels}
      onSelectModel={(m) => {
        useSelectionsStore.getState().selectModelFromCatalog(m);
      }}
    />
  );
}
