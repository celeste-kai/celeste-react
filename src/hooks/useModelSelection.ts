import { useEffect } from 'react';
import { useSelectionsStore } from '../lib/store/selections';
import { useModels, useProviders, useCapabilities } from '../lib/queries/discovery';
import { capabilityFilterMap, imageModeCapabilityMap } from '../lib/capability';

export function useModelSelection() {
  const selectedCapability = useSelectionsStore((s) => s.capability);
  const selectedModelValue = useSelectionsStore((s) => s.model);
  const setSelectedModel = useSelectionsStore((s) => s.setModel);
  const selectedProvider = useSelectionsStore((s) => s.provider);
  const setSelectedProvider = useSelectionsStore((s) => s.setProvider);
  const providerFilter = useSelectionsStore((s) => s.providerFilter);
  const setProviderFilter = useSelectionsStore((s) => s.setProviderFilter);
  const imageMode = useSelectionsStore((s) => s.imageMode);

  // Determine which capability to filter by based on mode
  const capabilityFilter =
    selectedCapability === 'image' && imageMode === 'edit'
      ? imageModeCapabilityMap[imageMode]
      : capabilityFilterMap[selectedCapability];

  // Use TanStack Query hooks for data fetching
  const { data: models = [], isFetching } = useModels({
    capability: capabilityFilter,
  });
  const { data: providers = [] } = useProviders();
  const { data: capabilities = [] } = useCapabilities();

  // Derived values
  const showText = capabilities.some((c: any) => c.id === 'text_generation');
  const showImage = capabilities.some((c: any) => c.id === 'image_generation');
  const showVideo = capabilities.some((c: any) => c.id === 'video_generation');

  const availableProviders = providers.filter((p) => models.some((m) => m.provider === p.id));

  const displayedModels =
    providerFilter === null ? models : models.filter((m) => m.provider === providerFilter);

  // Auto-selection effects
  useEffect(() => {
    if (selectedProvider && !availableProviders.some((p) => p.id === selectedProvider)) {
      setSelectedProvider(null);
    }
  }, [availableProviders, selectedProvider, setSelectedProvider]);

  useEffect(() => {
    // If the current providerFilter is no longer valid for the new capability, reset to All providers
    if (providerFilter && !availableProviders.some((p) => p.id === providerFilter)) {
      setProviderFilter(null);
    }
  }, [availableProviders, providerFilter, setProviderFilter]);

  useEffect(() => {
    if (!displayedModels || displayedModels.length === 0) {
      setSelectedModel(null);
      return;
    }
    if (!displayedModels.some((m) => m.id === (selectedModelValue || ''))) {
      // Use selectModelFromCatalog to set both model and provider
      useSelectionsStore.getState().selectModelFromCatalog(displayedModels[0]);
    }
  }, [displayedModels, selectedModelValue, setSelectedModel]);

  return {
    models: displayedModels,
    providers: availableProviders,
    isLoadingModels: isFetching && models.length === 0,
    showText,
    showImage,
    showVideo,
  };
}
