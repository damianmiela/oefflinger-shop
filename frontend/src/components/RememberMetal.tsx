"use client";

import { useEffect } from "react";

const STORAGE_KEY = "produkte-selected-metal";

export function RememberMetal({ metalId }: { metalId: string }) {
  useEffect(() => {
    if (metalId && typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, metalId);
    }
  }, [metalId]);
  return null;
}

export function getRememberedMetalId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STORAGE_KEY);
}
