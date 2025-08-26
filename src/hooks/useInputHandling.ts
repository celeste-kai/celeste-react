import { useState, useCallback } from "react";
import type React from "react";
import { useInteraction } from "../controllers/interaction";

export function useInputHandling() {
  const [inputValue, setInputValue] = useState("");
  const { submit } = useInteraction();

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
    (prompt: string, imageData?: any) => {
      submit(prompt, imageData);
      setInputValue("");
    },
    [submit],
  );

  const handleRefresh = useCallback(() => {
    setInputValue("");
  }, []);

  return {
    inputValue,
    setInputValue,
    handleInputChange,
    handleKeyPress,
    handleSend,
    handleRefresh,
  };
}
