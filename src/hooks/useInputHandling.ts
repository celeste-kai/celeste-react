import { useState, useCallback } from "react";
import type React from "react";
import { useSubmission } from "./useSubmission";
import type { ImageMode } from "../lib/capability";

interface UseInputHandlingProps {
  selectedCapability: "text" | "image" | "video";
  imageMode?: ImageMode;
  uploadedImage?: string;
  onClearImage?: () => void;
}

export function useInputHandling({
  selectedCapability,
  imageMode,
  uploadedImage,
  onClearImage,
}: UseInputHandlingProps) {
  const [inputValue, setInputValue] = useState("");
  const { submit } = useSubmission({
    selectedCapability,
    imageMode,
    uploadedImage,
    onClearImage,
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submit(inputValue);
        setInputValue("");
      }
    },
    [inputValue, submit],
  );

  const handleSend = useCallback(
    (prompt: string) => {
      submit(prompt);
      setInputValue("");
    },
    [submit],
  );

  return {
    inputValue,
    setInputValue,
    handleInputChange,
    handleKeyPress,
    handleSend,
  };
}
