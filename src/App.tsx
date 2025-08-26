import ResultSurface from "./components/results/ResultSurface";
import InputBar from "./components/input/InputBar";
import {
  useDragAndDrop,
  useModelSelection,
  useInputHandling,
  useSelections,
} from "./hooks";
import useImageUpload from "./common/hooks/useImageUpload";

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

  const { draggedImage, clearDraggedImage } = useDragAndDrop({
    onCapabilityChange: setSelectedCapability,
  });

  // Image upload state for the entire app
  const image = useImageUpload({
    externalImage: selectedCapability === "image" ? draggedImage : null,
    onHandled: clearDraggedImage,
  });

  const { inputValue, handleInputChange, handleKeyPress, handleSend, handleRefresh } =
    useInputHandling({
      selectedCapability,
      imageMode,
      uploadedImage: image.uploadedImage,
      onClearImage: image.clearImage,
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
        uploadedImage={image.uploadedImage}
        onClearImage={image.clearImage}
        fileInputRef={image.fileInputRef}
        onFileSelected={image.selectFile}
        isDragging={image.isDragging}
        onDrop={image.onDrop}
        onDragOver={image.onDragOver}
        onDragLeave={image.onDragLeave}
      />
    </div>
  );
}

export default App;
