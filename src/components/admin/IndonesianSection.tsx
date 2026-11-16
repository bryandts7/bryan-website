import type { ReactNode } from "react";

/**
 * Groups a form's optional Indonesian fields. Opens by itself when something
 * is already translated; empty fields mean visitors see the English text.
 */
export default function IndonesianSection({ translated, children }: { translated: boolean; children: ReactNode }) {
  return (
    <details open={translated} className="group rounded-lg border border-gray-200 bg-white p-4">
      <summary className="cursor-pointer text-sm font-semibold text-gray-900 select-none">
        🇮🇩 Indonesian version (optional)
        <span className="ml-2 font-normal text-gray-500">
          {translated ? "translated" : "not translated yet: visitors see the English"}
        </span>
      </summary>
      <div className="mt-5 space-y-6">{children}</div>
    </details>
  );
}
