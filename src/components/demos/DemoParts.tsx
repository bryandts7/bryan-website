"use client";

import { useId, type ReactNode } from "react";

/** The card every interactive demo sits in, set apart from the article text. */
export function DemoFrame({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <figure className="not-prose my-10 rounded-xl border border-line bg-card p-4 shadow-sm sm:p-6">
      <figcaption className="mb-5">
        <span className="text-xs font-semibold tracking-wide text-accent uppercase">Try it</span>
        <span className="mt-1 block text-lg font-semibold text-ink">{title}</span>
        {hint && <span className="mt-1 block text-sm text-muted">{hint}</span>}
      </figcaption>
      {children}
    </figure>
  );
}

/** A labelled range slider that shows its current value. */
export function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <label htmlFor={id} className="text-muted">
          {label}
        </label>
        <output htmlFor={id} className="font-mono font-semibold whitespace-nowrap text-ink">
          {display}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={display}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1.5 h-6 w-full cursor-pointer accent-accent"
      />
    </div>
  );
}

/** Small toggle buttons for presets and choices. */
export function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active ? "border-accent bg-accent-soft text-accent" : "border-line text-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function Stat({ label, value, tone = "ink" }: { label: string; value: string; tone?: "ink" | "accent" | "warn" }) {
  const color = tone === "accent" ? "text-accent" : tone === "warn" ? "text-warn" : "text-ink";
  return (
    <div className="rounded-lg bg-surface px-3 py-2.5">
      <div className="text-xs text-muted">{label}</div>
      <div className={`mt-0.5 font-mono text-lg font-semibold ${color}`}>{value}</div>
    </div>
  );
}

export const formatCount = (value: number) => Math.round(value).toLocaleString("en-US");

/**
 * Whole percents from 10% to 99%; one decimal below 10% and from 99.5% up (so
 * 99.9% never rounds to 100%), or always with `precise`.
 */
export function formatPercent(value: number, { precise = false } = {}): string {
  const percent = value * 100;
  if (percent > 0 && percent < 0.1) return "<0.1%";
  if (percent >= 99.95 && percent < 100) return ">99.9%";
  const decimals = precise || percent < 10 || percent >= 99.5 ? 1 : 0;
  return `${percent.toFixed(decimals)}%`;
}
