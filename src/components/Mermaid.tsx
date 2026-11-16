"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "@/lib/theme";

type State =
  | { status: "loading" }
  | { status: "ready"; svg: string }
  | { status: "failed" };

export default function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>({ status: "loading" });
  // Re-drawn when the visitor switches theme.
  const theme = useTheme();

  useEffect(() => {
    if (theme === null) return;
    let cancelled = false;
    // Dark diagrams in dark mode, except inside the always-light admin console.
    const dark = theme === "dark" && !ref.current?.closest(".light-only");

    // Loaded on demand so the library is only downloaded on posts with a diagram.
    import("mermaid")
      .then(async ({ default: mermaid }) => {
        mermaid.initialize({ startOnLoad: false, theme: dark ? "dark" : "default" });
        const { svg } = await mermaid.render(`mermaid-${id}`, chart);
        if (!cancelled) setState({ status: "ready", svg });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "failed" });
      });

    return () => {
      cancelled = true;
    };
  }, [chart, id, theme]);

  if (state.status === "failed") {
    return (
      <pre>
        <code>{chart}</code>
      </pre>
    );
  }

  return (
    <div ref={ref} className="not-prose my-6 flex justify-center overflow-x-auto">
      {state.status === "ready" ? (
        <div dangerouslySetInnerHTML={{ __html: state.svg }} />
      ) : (
        <span className="text-sm text-subtle">Loading diagram…</span>
      )}
    </div>
  );
}
