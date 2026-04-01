"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthScreen from "./AuthScreen";

export default function AppContainer({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--bg-color)" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "1.2rem" }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <>
      <div style={{ position: "absolute", top: "16px", right: "16px", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{user.email}</span>
          <button 
            onClick={() => {
               import("@/lib/firebase").then(({ auth }) => auth.signOut());
            }}
            style={{
              background: "var(--surface-bg)",
              border: "1px solid var(--border-color)",
              padding: "8px 16px",
              borderRadius: "8px",
              color: "var(--danger-color)",
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
              fontSize: "0.875rem",
              fontWeight: 600,
              transition: "all 0.2s"
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
      {children}
    </>
  );
}
