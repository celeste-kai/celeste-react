import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import styles from "./AuthScreen.module.css";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

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
      <form className={styles.authContainer} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Celeste</h1>
        <p className={styles.subtitle}>{isSignUp ? "Create account" : "Sign in"}</p>

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
            if (isSignUp) return "Sign Up";
            return "Sign In";
          })()}
        </button>

        <button
          className={styles.link}
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Already have an account?" : "Need an account?"}
        </button>
      </form>
    </div>
  );
}
