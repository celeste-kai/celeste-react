import ResultSurface from "./components/results/ResultSurface";
import InputBar from "./components/input/InputBar";
import {
  useDragAndDrop,
  useModelSelection,
  useInputHandling,
  useSelections,
} from "./hooks";

function App() {
  // Custom hooks for all complex logic
  const {
    selectedCapability,
    setSelectedCapability,
    selectedModelValue,
    setSelectedProvider,
    providerFilter,
    setProviderFilter,
    imageMode,
    setImageMode,
  } = useSelections();

  const { models, providers, isLoadingModels, showText, showImage, showVideo } =
    useModelSelection();
  const { inputValue, handleInputChange, handleKeyPress, handleSend, handleRefresh } =
    useInputHandling();
  const { draggedImage, clearDraggedImage } = useDragAndDrop({
    onCapabilityChange: setSelectedCapability,
  });

  return (
    <div className="app">
      <ResultSurface />
      <InputBar
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onKeyPress={handleKeyPress}
        onSend={handleSend}
        onRefresh={handleRefresh}
        selectedModel={selectedModelValue || ""}
        models={models}
        isLoadingModels={isLoadingModels}
        selectedCapability={selectedCapability}
        onSelectCapability={setSelectedCapability}
        providers={providers}
        selectedProvider={providerFilter || ""}
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
        onExternalImageHandled={clearDraggedImage}
      />
    </div>
  );
}

export default App;
