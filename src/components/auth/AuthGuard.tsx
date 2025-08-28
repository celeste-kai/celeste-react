import type { ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AuthScreen from "./AuthScreen";
import LoadingSpinner from "./LoadingSpinner";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication status
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "48px",
            borderRadius: "16px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <LoadingSpinner message="Checking authentication..." size="large" />
        </div>
      </div>
    );
  }

  // If authentication is required and user is not authenticated, show auth screen
  if (requireAuth && !user) {
    return <AuthScreen />;
  }

  // If user is authenticated or auth is not required, show the protected content
  return <>{children}</>;
}
