import { useEffect } from "react";
import { useSelectionStore } from "../stores/selection.store";
import { useModels, useProviders, useCapabilities } from "../lib/queries/discovery";
import { Capability, Provider } from "../core/enums";

const capabilityFilterMap: Record<string, string> = {
  [Capability.TEXT_GENERATION]: "text_generation",
  [Capability.IMAGE_GENERATION]: "image_generation",
  [Capability.IMAGE_EDIT]: "image_edit",
  [Capability.VIDEO_GENERATION]: "video_generation",
  [Capability.TEXT_TO_SPEECH]: "text_to_speech",
};

export function useModelSelection() {
  const selectedCapability = useSelectionStore((s) => s.capability);
  const selectedModelValue = useSelectionStore((s) => s.model);
  const selectedProvider = useSelectionStore((s) => s.provider);
  const providerFilter = useSelectionStore((s) => s.providerFilter);
  const selectModel = useSelectionStore((s) => s.selectModel);
  const setProvider = useSelectionStore((s) => s.setProvider);
  const setProviderFilter = useSelectionStore((s) => s.setProviderFilter);

  const capabilityFilter = capabilityFilterMap[selectedCapability];

  const { data: models = [], isFetching } = useModels(capabilityFilter);
  const { data: providers = [] } = useProviders();
  const { data: capabilities = [] } = useCapabilities();

  const showText = capabilities.some((c: { id: string }) => c.id === "text_generation");
  const showImage = capabilities.some(
    (c: { id: string }) => c.id === "image_generation",
  );
  const showVideo = capabilities.some(
    (c: { id: string }) => c.id === "video_generation",
  );
  const showAudio = capabilities.some((c: { id: string }) => c.id === "text_to_speech");

  const availableProviders = providers.filter((p: { id: string }) =>
    models.some((m: { provider: string }) => m.provider === p.id),
  );

  const displayedModels =
    providerFilter === null
      ? models
      : models.filter((m: { provider: string }) => m.provider === providerFilter);

  useEffect(() => {
    if (
      selectedProvider &&
      !availableProviders.some((p: { id: string }) => p.id === selectedProvider)
    ) {
      setProvider(Provider.OPENAI);
    }
  }, [availableProviders, selectedProvider, setProvider]);

  useEffect(() => {
    if (
      providerFilter &&
      !availableProviders.some((p: { id: string }) => p.id === providerFilter)
    ) {
      setProviderFilter(null);
    }
  }, [availableProviders, providerFilter, setProviderFilter]);

  useEffect(() => {
    if (!displayedModels.some((m: { id: string }) => m.id === selectedModelValue)) {
      const firstModel = displayedModels[0];
      if (firstModel && firstModel.id !== selectedModelValue) {
        selectModel(firstModel);
      }
    }
  }, [displayedModels, selectedModelValue, selectModel]);

  return {
    models: displayedModels,
    providers: availableProviders,
    isLoadingModels: isFetching && models.length === 0,
    showText,
    showImage,
    showVideo,
    showAudio,
  };
}
