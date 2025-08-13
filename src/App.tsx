import { useEffect } from 'react';
import { useSelectionsStore } from './lib/store/selections';
import Greeting from './components/chat/Greeting';
import MessagesList from './components/chat/MessagesList';
import ChatInput from './components/chat/ChatInput';
// Popups temporarily removed
import { useChat } from './hooks/useChat';
import { useModels, useProviders, useCapabilities } from './lib/queries/discovery';

function App() {
  const {
    inputValue,
    setInputValue,
    handleSend,
    handleKeyPress,
    handleRefresh,
    messages,
    isGenerating,
  } = useChat();

  const selectedCapability = useSelectionsStore((s) => s.capability);
  const setSelectedCapability = useSelectionsStore((s) => s.setCapability);
  const selectedModelValue = useSelectionsStore((s) => s.model);
  const setSelectedModel = useSelectionsStore((s) => s.setModel);
  const selectedProvider = useSelectionsStore((s) => s.provider);
  const setSelectedProvider = useSelectionsStore((s) => s.setProvider);

  // Map UI capability to backend capability enum name (lowercase)
  const capabilityFilterMap: Record<'text' | 'image' | 'video', string> = {
    text: 'text_generation',
    image: 'image_generation',
    video: 'video_generation',
  };

  // Use TanStack Query hook for models filtered by capability
  const { data: models = [], isFetching } = useModels({
    capability: capabilityFilterMap[selectedCapability],
  });
  const { data: providers = [] } = useProviders();
  const { data: capabilities = [] } = useCapabilities();

  const showText = capabilities.some((c: any) => c.id === 'text_generation');
  const showImage = capabilities.some((c: any) => c.id === 'image_generation');
  const showVideo = capabilities.some((c: any) => c.id === 'video_generation');

  const availableProviders = providers.filter((p) => models.some((m) => m.provider === p.id));
  const displayedModels = selectedProvider ? models.filter((m) => m.provider === selectedProvider) : models;

  // Ensure selectedModel remains valid as capability or provider changes
  useEffect(() => {
    if (selectedProvider && !availableProviders.some((p) => p.id === selectedProvider)) {
      setSelectedProvider(null);
    }
  }, [availableProviders, selectedProvider, setSelectedProvider]);

  useEffect(() => {
    if (!displayedModels || displayedModels.length === 0) {
      setSelectedModel(null);
      return;
    }
    if (!displayedModels.some((m) => m.id === (selectedModelValue || ''))) {
      setSelectedModel(displayedModels[0].id);
    }
  }, [displayedModels, selectedModelValue, setSelectedModel]);

  // When provider is "All providers", keep it null so other providers remain visible

  // Note: provider is chosen by the user; when it changes, the model effect above
  // will pick the first model for that provider if the current model no longer matches.

  return (
    <div className="app">
      {messages.length === 0 ? (
        <Greeting name="Kamil" />
      ) : (
        <MessagesList messages={messages} isGenerating={isGenerating} />
      )}
      <ChatInput
        inputValue={inputValue}
        onInputChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        onSend={handleSend}
        onRefresh={handleRefresh}
        selectedModel={selectedModelValue || ''}
        onChangeModel={(e) => setSelectedModel(e.target.value || null)}
        models={displayedModels}
        isLoadingModels={isFetching && models.length === 0}
        selectedCapability={selectedCapability}
        onSelectCapability={setSelectedCapability}
        providers={availableProviders}
        selectedProvider={selectedProvider || ''}
        onChangeProvider={(e) => setSelectedProvider(e.target.value || null)}
        showText={showText}
        showImage={showImage}
        showVideo={showVideo}
      />
    </div>
  );
}

export default App;
