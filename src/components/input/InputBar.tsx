import React, { useEffect } from "react";
import InputBarView from "./InputBarView";
import usePromptPlaceholder from "../../common/hooks/usePromptPlaceholder";
import useImageUpload from "../../common/hooks/useImageUpload";
import { useSelectionsStore } from "../../lib/store/selections";
import type { ModelOut, ProviderOut } from "../../types/api";
import type { ImageMode } from "../../lib/capability";

type Props = {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSend: (prompt: string, imageData?: string) => void;
  onRefresh: () => void;
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
  imageMode = "generate",
  onImageModeChange,
  showText = true,
  showImage = true,
  showVideo = true,
  externalImage,
  onExternalImageHandled,
}: Props) {
  const image = useImageUpload({
    externalImage: selectedCapability === "image" ? externalImage : null,
    onHandled: onExternalImageHandled,
  });

  useEffect(() => {
    if (selectedCapability === "image" && onImageModeChange) {
      onImageModeChange(image.uploadedImage ? "edit" : "generate");
    }
  }, [image.uploadedImage, selectedCapability, onImageModeChange]);

  const placeholder = usePromptPlaceholder({
    capability: selectedCapability,
    imageMode,
    hasImage: !!image.uploadedImage,
  });

  const handleSend = () => {
    if (selectedCapability === "image" && imageMode === "edit" && image.uploadedImage) {
      onSend(inputValue, image.uploadedImage);
      image.clearImage();
    } else {
      onSend(inputValue);
    }
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
      uploadedImage={image.uploadedImage}
      onClearImage={image.clearImage}
      fileInputRef={image.fileInputRef}
      onFileSelected={image.selectFile}
      isDragging={image.isDragging}
      onDrop={image.onDrop}
      onDragOver={image.onDragOver}
      onDragLeave={image.onDragLeave}
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
