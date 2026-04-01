"use client";

import React, { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // If already logged in, no need to show the Auth screen (handled by wrapper, but good safeguard)
  if (user) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message || "An error occurred with Google Sign-In");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Home Stash</h1>
          <p style={styles.subtitle}>{isLogin ? "Welcome back" : "Create an account"}</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleAuth} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={styles.input} 
              required 
              placeholder="you@email.com"
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={styles.input} 
              required 
              placeholder="••••••••"
            />
          </div>

          <button type="submit" style={styles.primaryButton} disabled={loading}>
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine}></span>
          <span style={styles.dividerText}>or continue with</span>
          <span style={styles.dividerLine}></span>
        </div>

        <button onClick={handleGoogleSignIn} style={styles.googleButton} type="button" disabled={loading}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.72 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
            <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.72 17.57C14.74 18.23 13.48 18.63 12 18.63C9.14 18.63 6.71 16.7 5.86 14.1H2.18V16.94C4.01 20.57 7.71 23 12 23Z" fill="#34A853"/>
            <path d="M5.86 14.1C5.64 13.45 5.52 12.74 5.52 12C5.52 11.26 5.64 10.55 5.86 9.9V7.06H2.18C1.43 8.55 1 10.22 1 12C1 13.78 1.43 15.45 2.18 16.94L5.86 14.1Z" fill="#FBBC05"/>
            <path d="M12 5.38C13.62 5.38 15.06 5.93 16.2 7.02L19.35 3.87C17.45 2.11 14.97 1 12 1C7.71 1 4.01 3.43 2.18 7.06L5.86 9.9C6.71 7.3 9.14 5.38 12 5.38Z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        <div style={styles.footer}>
          <button style={styles.toggleButton} onClick={() => setIsLogin(!isLogin)} type="button">
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg-color)",
    padding: "20px",
    fontFamily: "var(--font-inter)",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "var(--surface-bg)",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "var(--shadow-lg)",
    border: "1px solid var(--border-color)",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "32px",
  },
  title: {
    margin: 0,
    fontSize: "2.5rem",
    fontWeight: 800,
    letterSpacing: "-0.025em",
    background: "linear-gradient(135deg, #355E3B 0%, #5a9464 60%, #CCCCFF 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    margin: "8px 0 0",
    color: "var(--text-muted)",
    fontSize: "1.125rem",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    textAlign: "left" as const,
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "var(--text-main)",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    fontSize: "1rem",
    backgroundColor: "#f8fafc",
    transition: "all 0.2s ease",
    outline: "none",
  },
  primaryButton: {
    marginTop: "10px",
    width: "100%",
    background: "var(--primary-color)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "14px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s ease",
    boxShadow: "var(--shadow-sm)",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    margin: "24px 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "var(--border-color)",
  },
  dividerText: {
    padding: "0 10px",
    color: "var(--text-muted)",
    fontSize: "0.875rem",
  },
  googleButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    width: "100%",
    padding: "12px",
    background: "var(--surface-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: 600,
    color: "var(--text-main)",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "var(--shadow-sm)",
  },
  error: {
    background: "#fdf1f0",
    color: "var(--danger-color)",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "0.875rem",
    marginBottom: "20px",
    textAlign: "center" as const,
    border: "1px solid #f5c6c2",
  },
  footer: {
    marginTop: "24px",
    textAlign: "center" as const,
  },
  toggleButton: {
    background: "none",
    border: "none",
    color: "var(--hunter-green)",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
  }
};
