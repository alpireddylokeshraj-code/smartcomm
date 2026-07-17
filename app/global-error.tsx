"use client";

import * as React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#080d1a",
          color: "#e6ebf5",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: 24, maxWidth: 420 }}>
          <div
            style={{
              margin: "0 auto 20px",
              height: 56,
              width: 56,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(239,68,68,0.15)",
              color: "#f87171",
              fontSize: 28,
            }}
          >
            !
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
            Application error
          </h1>
          <p style={{ color: "#9aa6bf", fontSize: 14, marginTop: 8 }}>
            A critical error occurred. Please reload the application.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 24,
              padding: "10px 20px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              color: "#fff",
              fontWeight: 500,
              background: "linear-gradient(135deg,#6366f1,#a855f7,#0ea5e9)",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
