import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/auth/context";
import styles from "./AuthScreen.module.css";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      await supabase.auth.signUp({ email, password });
    } else {
      await supabase.auth.signInWithPassword({ email, password });
    }

    setLoading(false);
  };

  return (
    <div className={styles.authScreen}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <div className={styles.logo}>
            <img src="/celeste.svg" alt="Celeste" className={styles.logoIcon} />
            <h1>Celeste</h1>
          </div>
          <h2>Multi-modal AI Assistant</h2>
          <p>Sign in to access text generation, image creation, and video production</p>
        </div>

        <div className={styles.authContent}>
          <div className={styles.authOptions}>
            <button
              className={styles.googleAuthButton}
              onClick={signInWithGoogle}
              disabled={loading}
            >
              <div className={styles.googleIcon}>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              Continue with Google
            </button>

            <div className={styles.divider}>
              <span>or</span>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                className={styles.input}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className={styles.input}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button className={styles.primaryButton} type="submit" disabled={loading}>
                {(() => {
                  if (loading) return "...";
                  return isSignUp ? "Sign Up" : "Sign In";
                })()}
              </button>
            </form>

            <button
              className={styles.link}
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Need an account? Sign up"}
            </button>
          </div>

          <div className={styles.authFeatures}>
            <h3>What you can do:</h3>
            <div className={styles.featuresGrid}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>💬</div>
                <div>
                  <h4>Text Generation</h4>
                  <p>Chat with AI models from multiple providers</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>🎨</div>
                <div>
                  <h4>Image Creation</h4>
                  <p>Generate and edit images with AI</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>🎬</div>
                <div>
                  <h4>Video Generation</h4>
                  <p>Create videos from text prompts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
