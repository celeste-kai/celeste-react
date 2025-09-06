import React from "react";
import ResultSurface from "./components/results/ResultSurface";
import InputBar from "./components/input/InputBar";
import { AuthProvider } from "./contexts/AuthContext";
import { InputProvider } from "./contexts/InputContext";
import { ImageUploadProvider } from "./contexts/ImageUploadContext";
import { ModelSelectionProvider } from "./contexts/ModelSelectionContext";
import AuthGuard from "./components/auth/AuthGuard";
import { ConversationManager } from "./components/conversations/ConversationManager";

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <AuthGuard>
          <ImageUploadProvider>
            <InputProvider>
              <ModelSelectionProvider>
                <ConversationManager />
                <div className="main-content">
                  <ResultSurface />
                  <InputBar />
                </div>
              </ModelSelectionProvider>
            </InputProvider>
          </ImageUploadProvider>
        </AuthGuard>
      </AuthProvider>
    </div>
  );
}

export default App;
