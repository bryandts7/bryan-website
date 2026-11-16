"use client";

import { setLang, useLang, useT } from "@/lib/lang-client";

/** EN/ID switch: shows the current language, a click switches to the other. */
export default function LangToggle() {
  const lang = useLang();
  const t = useT();

  return (
    <button
      type="button"
      onClick={() => setLang(lang === "id" ? "en" : "id")}
      aria-label={t("lang.switchTo")}
      title={t("lang.switchTo")}
      className="rounded-md px-2 py-1.5 font-mono text-xs font-semibold text-muted transition-colors hover:bg-surface hover:text-ink"
    >
      {/* Both labels are in the page; CSS shows the current one (no flash). */}
      <span className="lang-en">
        <span className="text-ink">EN</span>
        <span className="text-subtle"> / ID</span>
      </span>
      <span className="lang-id">
        <span className="text-subtle">EN / </span>
        <span className="text-ink">ID</span>
      </span>
    </button>
  );
}
