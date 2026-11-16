"use client";

import { useT } from "@/lib/lang-client";
import { setTheme, useTheme } from "@/lib/theme";

/** Sun/moon button that switches between light and dark mode. */
export default function ThemeToggle() {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  const t = useT();
  const label = next === "light" ? t("theme.toLight") : t("theme.toDark");

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={theme ? label : "Switch colour theme"}
      title={theme ? label : undefined}
      className="rounded-md p-2 text-muted transition-colors hover:bg-surface hover:text-ink"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        {theme === "dark" ? (
          // Sun: shown in dark mode, switches to light.
          <>
            <circle cx="12" cy="12" r="4" />
            <path
              strokeLinecap="round"
              d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            />
          </>
        ) : theme === "light" ? (
          // Moon: shown in light mode, switches to dark.
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        ) : null}
      </svg>
    </button>
  );
}
