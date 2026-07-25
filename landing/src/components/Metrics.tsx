"use client";

import { useEffect, useRef, useState } from "react";
import { useSim } from "@/lib/sim";

function Spark({ data }: { data: number[] }) {
  const max = Math.max(1, ...data);
  const w = 120, h = 28;
  const pts = data.map((v, i) => `${(i / Math.max(1, data.length - 1)) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-full">
      <polyline points={pts} fill="none" stroke="var(--brand)" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function Stat({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: string }) {
  return (
    <div className="rounded-lg dock px-3 py-2">
      <div className="font-mono text-[9px] uppercase tracking-widest text-slate-500">{label}</div>
      <div className={`text-lg font-semibold ${tone || "text-slate-100"}`}>{value}</div>
      {sub && <div className="font-mono text-[9px] text-slate-500">{sub}</div>}
    </div>
  );
}

export default function Metrics() {
  const { counters, config } = useSim();
  const hist = useRef<number[]>([]);
  const [, force] = useState(0);

  useEffect(() => {
    hist.current.push(counters.perSec);
    if (hist.current.length > 40) hist.current.shift();
    force((n) => n + 1);
  }, [counters.perSec]);

  const lagTone = counters.lag > 50 ? "text-rose-300" : counters.lag > 5 ? "text-amber-300" : "text-emerald-300";
  const pct = Math.min(100, (counters.perSec / 10000) * 100);

  return (
    <div className="rounded-xl dock p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">live metrics</span>
        <span className="font-mono text-[9.5px] text-slate-500">
          consumers {config.consumers - (config.killConsumer ? 1 : 0)}{config.killConsumer && <span className="text-rose-400"> (1 down)</span>}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Throughput" value={`${counters.perSec.toLocaleString()}/s`} sub="of 10,000/s" />
        <Stat label="Consumer lag" value={Math.round(counters.lag).toLocaleString()} sub="messages" tone={lagTone} />
        <Stat label="End-to-end" value={`${counters.latencyMs} ms`} sub="p50 latency" />
        <div className="rounded-lg dock px-3 py-2">
          <div className="font-mono text-[9px] uppercase tracking-widest text-slate-500">Rate trend</div>
          <Spark data={hist.current.length ? hist.current : [0]} />
        </div>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all" style={{ width: `${pct}%` }} />
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {([
          ["iOS", counters.ios, "var(--ios)"],
          ["Android", counters.android, "var(--android)"],
          ["Missing", counters.missing, "var(--missing)"],
          ["Dropped", counters.dropped, "var(--dropped)"],
        ] as const).map(([k, v, c]) => (
          <div key={k} className="flex items-center gap-2 rounded-lg bg-black/20 px-2.5 py-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: c }} />
            <span className="text-[11px] text-slate-400">{k}</span>
            <span className="ml-auto font-mono text-[11px] text-slate-200">{v.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
