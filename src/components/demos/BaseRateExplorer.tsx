"use client";

import { useState } from "react";
import { runDetector } from "@/lib/base-rate";
import { Bi } from "../Lang";
import { Choice, DemoFrame, formatCount, formatPercent, Slider, Stat } from "./DemoParts";

const POPULATION = 1_000_000;

/** The bot-rate slider moves on a log scale: 1 in 2 (10^0.3) up to 1 in 100,000. */
const MIN_EXP = 0.3;
const MAX_EXP = 5;

const PRESETS = [
  { label: "Post example (1 in 1,000)", labelId: "Contoh di tulisan (1 dari 1.000)", oneIn: 1000, signals: 1 },
  { label: "Two signals (§4)", labelId: "Dua sinyal (§4)", oneIn: 1000, signals: 2 },
  { label: "Risky segment (1 in 10)", labelId: "Segmen berisiko (1 dari 10)", oneIn: 10, signals: 1 },
  { label: "50/50 test set", labelId: "Data uji 50/50", oneIn: 2, signals: 1 },
];

/** Round "1 in N" to a readable number (2 significant figures above 100). */
function niceOneIn(exponent: number): number {
  const raw = 10 ** exponent;
  if (raw < 100) return Math.round(raw);
  const magnitude = 10 ** (Math.floor(Math.log10(raw)) - 1);
  return Math.round(raw / magnitude) * magnitude;
}

export default function BaseRateExplorer() {
  const [oneIn, setOneIn] = useState(1000);
  const [recall, setRecall] = useState(0.99);
  const [falsePositiveRate, setFalsePositiveRate] = useState(0.01);
  const [signals, setSignals] = useState(1);

  const result = runDetector({ population: POPULATION, oneIn, recall, falsePositiveRate, signals });
  const botFlagsPer100 = Math.round(result.precision * 100);
  const innocentPerBot = result.truePositives > 0 ? result.falsePositives / result.truePositives : Infinity;

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setOneIn(preset.oneIn);
    setSignals(preset.signals);
    setRecall(0.99);
    setFalsePositiveRate(0.01);
  };
  const isPreset = (preset: (typeof PRESETS)[number]) =>
    oneIn === preset.oneIn && signals === preset.signals && recall === 0.99 && falsePositiveRate === 0.01;

  return (
    <DemoFrame
      title={<Bi en="Base-rate explorer" id="Penjelajah base rate" />}
      hint={
        <Bi
          en="1,000,000 devices. Move the sliders and watch how often a flag is actually right."
          id="1.000.000 perangkat. Geser slider dan lihat seberapa sering sebuah tanda (flag) benar-benar tepat."
        />
      }
    >
      <div className="mb-5 flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Choice key={preset.label} active={isPreset(preset)} onClick={() => applyPreset(preset)}>
            <Bi en={preset.label} id={preset.labelId} />
          </Choice>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Slider
          label={<Bi en="Bots in the population" id="Bot dalam populasi" />}
          value={Math.log10(oneIn)}
          display={<Bi en={`1 in ${formatCount(oneIn)}`} id={`1 dari ${formatCount(oneIn).replace(/,/g, ".")}`} />}
          valueText={`1 in ${formatCount(oneIn)}`}
          min={MIN_EXP}
          max={MAX_EXP}
          step={0.01}
          onChange={(exponent) => setOneIn(niceOneIn(exponent))}
        />
        <Slider
          label={<Bi en="Bots each signal catches (recall)" id="Bot yang tertangkap tiap sinyal (recall)" />}
          value={recall * 100}
          display={`${(recall * 100).toFixed(1)}%`}
          valueText={`${(recall * 100).toFixed(1)}%`}
          min={50}
          max={99.9}
          step={0.1}
          onChange={(percent) => setRecall(Math.round(percent * 10) / 1000)}
        />
        <Slider
          label={<Bi en="Real devices each signal wrongly flags" id="Perangkat asli yang salah ditandai tiap sinyal" />}
          value={falsePositiveRate * 100}
          display={`${(falsePositiveRate * 100).toFixed(1)}%`}
          valueText={`${(falsePositiveRate * 100).toFixed(1)}%`}
          min={0.1}
          max={20}
          step={0.1}
          onChange={(percent) => setFalsePositiveRate(Math.round(percent * 10) / 1000)}
        />
        <div>
          <div className="text-sm text-muted">
            <Bi en="Independent signals a device must trip" id="Sinyal independen yang harus dipicu perangkat" />
          </div>
          <div className="mt-2 flex gap-2">
            {[1, 2, 3].map((count) => (
              <Choice key={count} active={signals === count} onClick={() => setSignals(count)}>
                {count} <Bi en={count > 1 ? "signals" : "signal"} id="sinyal" />
              </Choice>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label={<Bi en="Bots flagged" id="Bot ditandai" />} value={formatCount(result.truePositives)} tone="accent" />
        <Stat label={<Bi en="Innocent flagged" id="Tak bersalah ditandai" />} value={formatCount(result.falsePositives)} tone="warn" />
        <Stat label={<Bi en="Bots missed" id="Bot lolos" />} value={formatCount(result.falseNegatives)} />
        <Stat label={<Bi en="Real left alone" id="Asli dibiarkan" />} value={formatCount(result.trueNegatives)} />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
        <FlagGrid botFlags={botFlagsPer100} hasFlags={result.flags >= 0.5} />
        <div aria-live="polite">
          <div className="text-sm text-muted">
            <Bi en="When it flags a device, it's right" id="Saat menandai perangkat, ia benar" />
          </div>
          <div className="font-mono text-4xl font-bold text-ink">{formatPercent(result.precision)}</div>
          <div className="text-sm text-muted">
            <Bi en="of the time (precision)" id="dari seluruh tanda (presisi)" />
          </div>
          <p className="mt-3 text-sm text-muted">
            {result.flags < 0.5 ? (
              <Bi
                en="It flags almost nothing at these settings."
                id="Dengan pengaturan ini, hampir tidak ada yang ditandai."
              />
            ) : innocentPerBot >= 1 ? (
              <Bi
                en={`About ${formatCount(innocentPerBot)} innocent device${Math.round(innocentPerBot) === 1 ? "" : "s"} flagged for every real bot.`}
                id={`Sekitar ${formatCount(innocentPerBot).replace(/,/g, ".")} perangkat tak bersalah ditandai untuk setiap bot asli.`}
              />
            ) : (
              <Bi
                en={`About ${formatCount(1 / innocentPerBot)} real bots flagged for every innocent device.`}
                id={`Sekitar ${formatCount(1 / innocentPerBot).replace(/,/g, ".")} bot asli ditandai untuk setiap perangkat tak bersalah.`}
              />
            )}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Stat label={<Bi en="Accuracy" id="Akurasi" />} value={formatPercent(result.accuracy, { precise: true })} />
            <Stat label={<Bi en="“Never flag” accuracy" id="Akurasi “tidak pernah menandai”" />} value={formatPercent(result.doNothingAccuracy, { precise: true })} />
          </div>
        </div>
      </div>
    </DemoFrame>
  );
}

/** 100 squares: out of every 100 flags, how many are bots (blue) vs innocent (orange). */
function FlagGrid({ botFlags, hasFlags }: { botFlags: number; hasFlags: boolean }) {
  return (
    <div>
      <div
        className="grid w-40 grid-cols-10 gap-1 sm:w-44"
        role="img"
        aria-label={hasFlags ? `Out of every 100 flags, ${botFlags} are bots and ${100 - botFlags} are innocent devices` : "No flags"}
      >
        {Array.from({ length: 100 }, (_, index) => (
          <span
            key={index}
            className={`aspect-square rounded-[2px] ${
              !hasFlags ? "bg-surface" : index < botFlags ? "bg-accent" : "bg-warn"
            }`}
          />
        ))}
      </div>
      <div className="mt-2 flex gap-3 text-xs text-muted">
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-[2px] bg-accent" /> bot
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-[2px] bg-warn" /> <Bi en="innocent" id="tak bersalah" />
        </span>
        <span>
          <Bi en="per 100 flags" id="per 100 tanda" />
        </span>
      </div>
    </div>
  );
}
