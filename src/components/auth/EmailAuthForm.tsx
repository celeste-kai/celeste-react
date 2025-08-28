import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./EmailAuthForm.module.css";

interface EmailAuthFormProps {
  mode: "signin" | "signup";
  onModeChange: (mode: "signin" | "signup") => void;
}

export default function EmailAuthForm({ mode, onModeChange }: EmailAuthFormProps) {
  const { signInWithEmail, signUpWithEmail, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "signup" && password !== confirmPassword) {
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    if (!email || !password) return false;
    if (mode === "signup" && password !== confirmPassword) return false;
    return true;
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={isLoading}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          disabled={isLoading}
          minLength={6}
        />
      </div>

      {mode === "signup" && (
        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
            disabled={isLoading}
            minLength={6}
          />
          {password !== confirmPassword && confirmPassword && (
            <span className={styles.passwordError}>Passwords don't match</span>
          )}
        </div>
      )}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={!isFormValid() || isLoading}
      >
        {(() => {
          if (isLoading) {
            return mode === "signin" ? "Signing in..." : "Creating account...";
          }
          return mode === "signin" ? "Sign In" : "Create Account";
        })()}
      </button>

      {error && <div className={styles.errorMessage}>{error.message}</div>}

      <div className={styles.modeSwitch}>
        {mode === "signin" ? (
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => onModeChange("signup")}
              disabled={isLoading}
            >
              Sign up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => onModeChange("signin")}
              disabled={isLoading}
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </form>
  );
}
