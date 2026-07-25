"use client";

import { useEffect, useRef, useState } from "react";
import { useSim } from "@/lib/sim";

function mmss(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export default function AnalyticsPanel() {
  const { counters } = useSim();
  const [on, setOn] = useState(false);
  const [now, setNow] = useState(Date.now());
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!on) return;
    if (startRef.current == null) startRef.current = Date.now();
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [on]);

  const uptime = startRef.current ? now - startRef.current : 0;
  const routed = counters.ios + counters.android + counters.missing + counters.dropped || 1;
  const dist = [
    ["iOS", counters.ios, "var(--ios)"],
    ["Android", counters.android, "var(--android)"],
    ["Missing", counters.missing, "var(--missing)"],
    ["Dropped", counters.dropped, "var(--dropped)"],
  ] as const;

  return (
    <section id="analytics" className="border-t border-line bg-bg-subtle">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-semibold">Session analytics</h2>
          <span className="text-[12px] text-muted">opt-in, local to your browser, nothing leaves the page</span>
          <button
            onClick={() => setOn((v) => !v)}
            className={`ml-auto inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
              on ? "bg-brand text-white" : "border border-line text-muted hover:text-fg"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-white" : "bg-muted"}`} />
            {on ? "tracking on" : "track analytics"}
          </button>
        </div>

        {!on ? (
          <p className="mt-4 max-w-xl text-[13px] text-muted">
            Toggle tracking to measure your session: total events routed, peak throughput you pushed the
            pipeline to, route distribution, and how many chaos interactions you triggered. Useful for
            the same reason real pipelines need telemetry: you cannot improve what you do not measure.
          </p>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <Card label="Session" value={mmss(uptime)} />
            <Card label="Events produced" value={counters.produced.toLocaleString()} />
            <Card label="Peak throughput" value={`${counters.peakPerSec.toLocaleString()}/s`} />
            <Card label="Interactions" value={String(counters.interactions)} sub="control changes" />

            <div className="surface rounded-xl p-4 sm:col-span-2">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">route distribution</div>
              <div className="flex h-3 overflow-hidden rounded-full bg-bg">
                {dist.map(([k, v, c]) => (
                  <div key={k} style={{ width: `${(v / routed) * 100}%`, background: c }} title={`${k}: ${v}`} />
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                {dist.map(([k, v, c]) => (
                  <span key={k} className="inline-flex items-center gap-1.5 text-muted">
                    <span className="h-2 w-2 rounded-full" style={{ background: c }} />
                    {k} <span className="font-mono text-fg">{Math.round((v / routed) * 100)}%</span>
                  </span>
                ))}
              </div>
            </div>

            <Card label="Anomalies flagged" value={String(counters.anomalies)} tone="text-amber-500" />
            <Card label="Consumer lag now" value={String(Math.round(counters.lag))} tone={counters.lag > 50 ? "text-rose-500" : "text-emerald-500"} />
          </div>
        )}
      </div>
    </section>
  );
}

function Card({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: string }) {
  return (
    <div className="surface rounded-xl px-4 py-3">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted">{label}</div>
      <div className={`text-2xl font-semibold ${tone || "text-fg"}`}>{value}</div>
      {sub && <div className="font-mono text-[10px] text-muted">{sub}</div>}
    </div>
  );
}
