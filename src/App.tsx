import ResultSurface from "./components/results/ResultSurface";
import InputBar from "./components/input/InputBar";
import { AuthProvider } from "./lib/auth/context";
import AuthGuard from "./components/auth/AuthGuard";
import { ConversationManager } from "./components/conversations/ConversationManager";

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <AuthGuard>
          <ConversationManager />
          <div className="main-content">
            <ResultSurface />
            <InputBar />
          </div>
        </AuthGuard>
      </AuthProvider>
    </div>
  );
}

export default App;
