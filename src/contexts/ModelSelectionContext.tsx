import type { ReactNode } from "react";
import React, { createContext, useContext } from "react";
import { useModelSelection } from "../hooks/useModelSelection";
import { useSelections } from "../hooks/useSelections";
import type { ModelOut, ProviderOut } from "../types/api";

interface ModelSelectionContextValue {
  models: ModelOut[];
  providers: ProviderOut[];
  isLoadingModels: boolean;
  showText: boolean;
  showImage: boolean;
  showVideo: boolean;
  showAudio: boolean;
  selectedModelValue: string | null;
  selectedProvider: string | null;
  providerFilter: string | null;
  setProviderFilter: (filter: string | null) => void;
}

const ModelSelectionContext = createContext<ModelSelectionContextValue | undefined>(
  undefined,
);

interface Props {
  children: ReactNode;
}

export function ModelSelectionProvider({ children }: Props) {
  const {
    models,
    providers,
    isLoadingModels,
    showText,
    showImage,
    showVideo,
    showAudio,
  } = useModelSelection();

  const { selectedModelValue, selectedProvider, providerFilter, setProviderFilter } =
    useSelections();

  const value: ModelSelectionContextValue = {
    models,
    providers,
    isLoadingModels,
    showText,
    showImage,
    showVideo,
    showAudio,
    selectedModelValue,
    selectedProvider,
    providerFilter,
    setProviderFilter,
  };

  return (
    <ModelSelectionContext.Provider value={value}>
      {children}
    </ModelSelectionContext.Provider>
  );
}

export function useModelSelectionContext() {
  const context = useContext(ModelSelectionContext);
  if (context === undefined) {
    throw new Error(
      "useModelSelectionContext must be used within a ModelSelectionProvider",
    );
  }
  return context;
}
