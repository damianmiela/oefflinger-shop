"use client";

/**
 * Global error boundary (P2-18b → §3.10). Only triggers when the root layout
 * itself throws, so it must render its own <html>/<body> and CANNOT rely on the
 * app's CSS (globals.css is imported by the layout that just failed). Styles are
 * therefore inline, using the brand palette, so the page still looks intentional.
 */
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="de">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          color: "#1f2937",
          background: "#f8fafb",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#1e5f74",
            fontSize: "0.875rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Fehler
        </p>
        <h1 style={{ margin: "0.75rem 0 0", fontSize: "2.25rem", fontWeight: 700, color: "#111827" }}>
          Etwas ist schiefgelaufen
        </h1>
        <p style={{ margin: "1rem 0 0", maxWidth: "28rem", fontSize: "1.125rem", color: "#4b5563" }}>
          Beim Laden der Seite ist ein unerwarteter Fehler aufgetreten. Bitte laden Sie die Seite
          neu.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            marginTop: "2rem",
            cursor: "pointer",
            borderRadius: "0.5rem",
            border: "none",
            background: "#1e5f74",
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            fontWeight: 600,
            color: "#ffffff",
          }}
        >
          Seite neu laden
        </button>
      </body>
    </html>
  );
}
