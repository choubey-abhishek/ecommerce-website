"use client";

import { useEffect } from "react";
import "./globals.css";

/**
 * The fallback for errors thrown in the root layout itself (app/layout.tsx)
 * — a much rarer case than app/error.tsx, but Next requires this file to
 * render its own <html>/<body> since it replaces the entire root layout,
 * fonts/providers included. Kept intentionally minimal and dependency-free
 * (no Button/Container/next/font/Clerk) so it can't itself fail the same
 * way the layout it's replacing did.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error-boundary]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "28rem" }}>
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8a8a8a" }}>
            Kopal Seth Studio
          </p>
          <h1 style={{ marginTop: "0.75rem", fontSize: "1.5rem", fontWeight: 400 }}>
            The Site Hit an Unexpected Error
          </h1>
          <p style={{ marginTop: "1rem", fontSize: "0.95rem", lineHeight: 1.6, color: "#666" }}>
            This has been logged. Please refresh the page — if it keeps
            happening, reach out at{" "}
            {/* Hardcoded, not imported from config/site.ts, on purpose:
                this file exists to render even if something else in the
                app (in principle, even config) is broken. */}
            <a href="mailto:kopalsethstudio@gmail.com">kopalsethstudio@gmail.com</a>.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "2rem",
              padding: "0.75rem 1.75rem",
              borderRadius: "9999px",
              background: "#1a1a1a",
              color: "#fff",
              border: "none",
              fontSize: "0.8rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
