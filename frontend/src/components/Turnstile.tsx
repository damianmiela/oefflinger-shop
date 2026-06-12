"use client";

import { useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileWindow extends Window {
  turnstile?: {
    render: (
      el: HTMLElement,
      options: {
        sitekey: string;
        callback: (token: string) => void;
        "expired-callback"?: () => void;
        theme?: string;
        language?: string;
      },
    ) => string;
    remove: (widgetId: string) => void;
  };
}

/**
 * Invisible-friendly Cloudflare Turnstile widget.
 * Renders nothing when NEXT_PUBLIC_TURNSTILE_SITE_KEY is not configured.
 */
export function Turnstile({ onToken }: { onToken: (token: string | null) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!SITE_KEY || !containerRef.current) return;

    function render() {
      const w = window as TurnstileWindow;
      if (!w.turnstile || !containerRef.current || widgetIdRef.current) return;
      widgetIdRef.current = w.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        callback: (token) => onToken(token),
        "expired-callback": () => onToken(null),
        theme: "light",
        language: "de",
      });
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src^="https://challenges.cloudflare.com/turnstile"]`,
    );
    if ((window as TurnstileWindow).turnstile) {
      render();
    } else if (existing) {
      existing.addEventListener("load", render);
    } else {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.addEventListener("load", render);
      document.head.appendChild(script);
    }

    return () => {
      const w = window as TurnstileWindow;
      if (widgetIdRef.current && w.turnstile) {
        w.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={containerRef} />;
}

export const turnstileEnabled = Boolean(SITE_KEY);
