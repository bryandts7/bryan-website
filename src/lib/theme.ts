"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "./theme-script";

export type Theme = "light" | "dark";

const DARK_QUERY = "(prefers-color-scheme: dark)";

/** The theme on screen now: the visitor's choice, else their system setting. */
function readTheme(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "light" || chosen === "dark") return chosen;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener("change", onChange);
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => {
    media.removeEventListener("change", onChange);
    observer.disconnect();
  };
}

/** Current theme, or null while rendering on the server (unknown there). */
export function useTheme(): Theme | null {
  return useSyncExternalStore(subscribe, readTheme, () => null);
}

/** Apply and remember a theme choice. */
export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage blocked: the choice still applies until the page is reloaded.
  }
}
