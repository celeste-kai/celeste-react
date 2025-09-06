import type { ReactNode } from "react";
import React, { createContext, useContext } from "react";
import { useInputHandling } from "../hooks/useInputHandling";
import { useSelections } from "../hooks/useSelections";
import { useImageUploadContext } from "./ImageUploadContext";
import type { CapabilityId } from "../stores/selections";
import type { ImageMode } from "../lib/capability";

interface InputContextValue {
  inputValue: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSend: () => void;
  selectedCapability: CapabilityId;
  setSelectedCapability: (cap: CapabilityId) => void;
  imageMode: ImageMode;
  setImageMode: (mode: ImageMode) => void;
}

const InputContext = createContext<InputContextValue | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function InputProvider({ children }: Props) {
  const { selectedCapability, setSelectedCapability, imageMode, setImageMode } =
    useSelections();

  const { uploadedImage, clearImage } = useImageUploadContext();

  const { inputValue, handleInputChange, handleKeyPress, handleSend } =
    useInputHandling({
      selectedCapability,
      imageMode,
      uploadedImage,
      onClearImage: clearImage,
    });

  // Create a wrapper that sends the current input value
  const sendMessage = () => {
    handleSend(inputValue);
  };

  const value: InputContextValue = {
    inputValue,
    handleInputChange,
    handleKeyPress,
    handleSend: sendMessage,
    selectedCapability,
    setSelectedCapability,
    imageMode,
    setImageMode,
  };

  return <InputContext.Provider value={value}>{children}</InputContext.Provider>;
}

export function useInputContext() {
  const context = useContext(InputContext);
  if (context === undefined) {
    throw new Error("useInputContext must be used within an InputProvider");
  }
  return context;
}
