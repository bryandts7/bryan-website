"use client";

import { useSyncExternalStore } from "react";
import { LANG_STORAGE_KEY, MESSAGES, type Lang, type MessageKey } from "./i18n";

function readLang(): Lang {
  return document.documentElement.dataset.lang === "id" ? "id" : "en";
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-lang"] });
  return () => observer.disconnect();
}

/**
 * The chosen language, for the few places CSS can't switch (attributes such
 * as aria-label or placeholder). Visible text should use <T>/<Bi> instead.
 */
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, readLang, () => "en");
}

/** Text for an attribute in the chosen language. */
export function useT(): (key: MessageKey) => string {
  const lang = useLang();
  return (key) => MESSAGES[lang][key];
}

/** Apply and remember a language choice. */
export function setLang(lang: Lang) {
  const root = document.documentElement;
  if (lang === "id") root.dataset.lang = "id";
  else delete root.dataset.lang;
  root.lang = lang;
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Storage blocked: the choice still applies until the page is reloaded.
  }
}
