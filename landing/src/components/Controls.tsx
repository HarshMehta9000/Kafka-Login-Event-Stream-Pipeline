"use client";

import { useSim } from "@/lib/sim";

function Slider({
  label, value, min, max, step, onChange, fmt,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; fmt: (v: number) => string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="text-slate-400">{label}</span>
        <span className="font-mono text-brand">{fmt(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[var(--brand)]"
      />
    </div>
  );
}

function Toggle({
  label, active, onClick, tone = "brand",
}: {
  label: string; active: boolean; onClick: () => void; tone?: "brand" | "warn" | "bad";
}) {
  const toneCls =
    tone === "warn" ? "border-amber-500/50 bg-amber-500/15 text-amber-300" :
    tone === "bad" ? "border-rose-500/50 bg-rose-500/15 text-rose-300" :
    "border-brand/50 bg-brand/15 text-brand";
  return (
    <button
      onClick={onClick}
      className={`rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
        active ? toneCls : "border-white/10 text-slate-400 hover:text-slate-200"
      }`}
    >
      {active ? "● " : ""}{label}
    </button>
  );
}

export default function Controls() {
  const { config, setConfig } = useSim();
  return (
    <div className="flex h-full flex-col gap-4 rounded-xl dock p-4">
      <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">controls</div>

      <Slider label="Produce rate" value={config.rate} min={20} max={10000} step={10}
        onChange={(v) => setConfig({ rate: v })} fmt={(v) => `${v.toLocaleString()} ev/s`} />
      <Slider label="Partitions" value={config.partitions} min={1} max={12} step={1}
        onChange={(v) => setConfig({ partitions: v })} fmt={(v) => `${v}`} />
      <Slider label="Consumers" value={config.consumers} min={1} max={6} step={1}
        onChange={(v) => setConfig({ consumers: v, killConsumer: false })} fmt={(v) => `${v}`} />

      <div>
        <div className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">chaos</div>
        <div className="grid grid-cols-2 gap-1.5">
          <Toggle label="Spike traffic" tone="warn" active={config.spike}
            onClick={() => setConfig({ spike: !config.spike })} />
          <Toggle label="Kill consumer" tone="bad" active={config.killConsumer}
            onClick={() => setConfig({ killConsumer: !config.killConsumer })} />
          <Toggle label="Schema strict" active={config.schemaStrict}
            onClick={() => setConfig({ schemaStrict: !config.schemaStrict })} />
          <Toggle label={config.paused ? "Resume" : "Pause"} active={config.paused}
            onClick={() => setConfig({ paused: !config.paused })} />
        </div>
      </div>

      <div className="mt-auto rounded-lg border border-white/10 bg-black/30 p-2.5 font-mono text-[10px] leading-relaxed text-slate-400">
        capacity = {Math.max(1, config.consumers - (config.killConsumer ? 1 : 0)) * 1400} ev/s.
        push rate above it to grow consumer lag.
      </div>
    </div>
  );
}
