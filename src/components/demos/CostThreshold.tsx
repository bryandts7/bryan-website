"use client";

import { useState } from "react";
import { flagThreshold, runDetector } from "@/lib/base-rate";
import { DemoFrame, formatPercent, Slider } from "./DemoParts";

/** Cost ratio slider on a log scale: a false flag costs 1/10 up to 10 times a miss. */
const MIN_EXP = -1;
const MAX_EXP = 1;

const post = { population: 1_000_000, oneIn: 1000, recall: 0.99, falsePositiveRate: 0.01 };
const EXAMPLES = [
  { label: "One signal", probability: runDetector({ ...post, signals: 1 }).precision },
  { label: "Two signals", probability: runDetector({ ...post, signals: 2 }).precision },
];

function describeRatio(ratio: number): string {
  if (Math.abs(ratio - 1) < 0.05) return "A false flag costs the same as a miss";
  if (ratio > 1) return `A false flag costs ${ratio.toFixed(1)}× a miss`;
  return `A miss costs ${(1 / ratio).toFixed(1)}× a false flag`;
}

export default function CostThreshold() {
  const [exponent, setExponent] = useState(Math.log10(4));
  const ratio = 10 ** exponent;
  const threshold = flagThreshold(ratio, 1);

  return (
    <DemoFrame
      title="How sure should you be before flagging?"
      hint="Set how much worse a wrong flag is than a missed bot. The examples use the post's detector (bots 1 in 1,000)."
    >
      <Slider
        label="Cost of a false flag vs a miss"
        value={exponent}
        display={describeRatio(ratio)}
        min={MIN_EXP}
        max={MAX_EXP}
        step={0.01}
        onChange={setExponent}
      />

      <p className="mt-5 text-sm text-muted" aria-live="polite">
        Flag only when you&apos;re more than{" "}
        <span className="font-mono text-2xl font-bold text-ink">{formatPercent(threshold, { precise: true })}</span> sure it&apos;s a bot.
      </p>

      {/* 0–100% line with the cut-off and the two example detectors. */}
      <div className="relative mt-10 mb-16 h-2 rounded-full bg-surface">
        <div className="absolute inset-y-0 right-0 rounded-r-full bg-accent-soft" style={{ left: `${threshold * 100}%` }} />
        <div className="absolute -top-7 -translate-x-1/2 text-xs font-medium text-ink" style={{ left: `${threshold * 100}%` }}>
          cut-off
        </div>
        <div className="absolute -top-2 h-6 w-0.5 -translate-x-1/2 bg-ink" style={{ left: `${threshold * 100}%` }} />
        {EXAMPLES.map((example, index) => {
          const flagged = example.probability > threshold;
          return (
            <div
              key={example.label}
              className="absolute top-1/2 flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${example.probability * 100}%` }}
            >
              <span
                className={`-mt-1.5 h-3 w-3 rounded-full ring-2 ring-card ${flagged ? "bg-accent" : "bg-warn"}`}
              />
              <span
                className={`mt-1 text-center text-xs leading-tight whitespace-nowrap ${index === 0 ? "translate-x-1/3" : "-translate-x-1/3"}`}
              >
                <span className="block text-muted">
                  {example.label}: {formatPercent(example.probability, { precise: true })}
                </span>
                <span className={`block font-semibold ${flagged ? "text-accent" : "text-warn"}`}>
                  {flagged ? "flag" : "don't flag"}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </DemoFrame>
  );
}
