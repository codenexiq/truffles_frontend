"use client";

import { useSyncExternalStore } from "react";

/**
 * Hook to detect if a media query matches.
 * Uses React's external-store API, so it is correct during server rendering (false) and updates live.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
