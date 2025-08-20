import { useEffect, useState } from 'react';
import { useSelectionsStore } from './lib/store/selections';
import ResultSurface from './components/results/ResultSurface';
import InputBar from './components/input/InputBar';
// Popups temporarily removed
import { useInteraction } from './controllers/interaction';
import { useModels, useProviders, useCapabilities } from './lib/queries/discovery';
import { capabilityFilterMap, imageModeCapabilityMap } from './lib/capability';
import { fileToDataUrl } from './utils/image';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [draggedImage, setDraggedImage] = useState<string | null>(null);
  const { submit } = useInteraction();

  const selectedCapability = useSelectionsStore((s) => s.capability);
  const setSelectedCapability = useSelectionsStore((s) => s.setCapability);
  const selectedModelValue = useSelectionsStore((s) => s.model);
  const setSelectedModel = useSelectionsStore((s) => s.setModel);
  const selectedProvider = useSelectionsStore((s) => s.provider);
  const setSelectedProvider = useSelectionsStore((s) => s.setProvider);
  const providerFilter = useSelectionsStore((s) => s.providerFilter);
  const setProviderFilter = useSelectionsStore((s) => s.setProviderFilter);
  const imageMode = useSelectionsStore((s) => s.imageMode);
  const setImageMode = useSelectionsStore((s) => s.setImageMode);

  // capability map imported from a single source

  // Determine which capability to filter by based on mode
  const capabilityFilter =
    selectedCapability === 'image' && imageMode === 'edit'
      ? imageModeCapabilityMap[imageMode]
      : capabilityFilterMap[selectedCapability];

  // Use TanStack Query hook for models filtered by capability
  const { data: models = [], isFetching } = useModels({
    capability: capabilityFilter,
  });
  const { data: providers = [] } = useProviders();
  const { data: capabilities = [] } = useCapabilities();

  const showText = capabilities.some((c: any) => c.id === 'text_generation');
  const showImage = capabilities.some((c: any) => c.id === 'image_generation');
  const showVideo = capabilities.some((c: any) => c.id === 'video_generation');

  const availableProviders = providers.filter((p) => models.some((m) => m.provider === p.id));
  const displayedModels =
    providerFilter === null ? models : models.filter((m) => m.provider === providerFilter);

  // Ensure selectedModel remains valid as capability or provider changes
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
      setSelectedModel(displayedModels[0].id);
    }
  }, [displayedModels, selectedModelValue, setSelectedModel]);

  // Provider auto-selection now handled within `useSelectionsStore.selectModelFromCatalog`

  // When provider is "All providers", keep it null so other providers remain visible

  // Note: provider is chosen by the user; when it changes, the model effect above
  // will pick the first model for that provider if the current model no longer matches.

  // Global drag and drop handlers
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const file = e.dataTransfer?.files[0];
      if (file && file.type.startsWith('image/')) {
        // Auto-switch to image capability
        setSelectedCapability('image');

        // Convert to data URL using utility
        const dataUrl = await fileToDataUrl(file);
        setDraggedImage(dataUrl);
      }
    };

    // Add listeners to the entire document
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, [setSelectedCapability]);

  return (
    <div className="app">
      <ResultSurface />
      <InputBar
        inputValue={inputValue}
        onInputChange={(e) => setInputValue(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit(inputValue);
            setInputValue('');
          }
        }}
        onSend={(prompt, imageData) => {
          submit(prompt, imageData);
          setInputValue('');
        }}
        onRefresh={() => setInputValue('')}
        selectedModel={selectedModelValue || ''}
        models={displayedModels}
        isLoadingModels={isFetching && models.length === 0}
        selectedCapability={selectedCapability}
        onSelectCapability={setSelectedCapability}
        providers={availableProviders}
        selectedProvider={providerFilter || ''}
        onChangeProvider={(value) => {
          setProviderFilter(value);
          if (value !== null) {
            setSelectedProvider(value);
          }
        }}
        showText={showText}
        showImage={showImage}
        showVideo={showVideo}
        imageMode={imageMode}
        onImageModeChange={setImageMode}
        externalImage={draggedImage}
        onExternalImageHandled={() => setDraggedImage(null)}
      />
    </div>
  );
}

export default App;
