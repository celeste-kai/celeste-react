import type { ReactNode } from "react";
import { useAuth } from "../../lib/auth/context";
import AuthScreen from "./AuthScreen";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (!user) return <AuthScreen />;

  return <>{children}</>;
}
