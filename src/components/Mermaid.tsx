"use client";

import { useEffect, useId, useState } from "react";

type State =
  | { status: "loading" }
  | { status: "ready"; svg: string }
  | { status: "failed" };

export default function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    // Loaded on demand so the library is only downloaded on posts with a diagram.
    import("mermaid")
      .then(async ({ default: mermaid }) => {
        mermaid.initialize({ startOnLoad: false });
        const { svg } = await mermaid.render(`mermaid-${id}`, chart);
        if (!cancelled) setState({ status: "ready", svg });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "failed" });
      });

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (state.status === "ready") {
    return (
      <div
        className="not-prose my-6 flex justify-center overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: state.svg }}
      />
    );
  }

  if (state.status === "failed") {
    return (
      <pre>
        <code>{chart}</code>
      </pre>
    );
  }

  return (
    <div className="not-prose my-6 text-center text-sm text-gray-500">
      Loading diagram…
    </div>
  );
}
