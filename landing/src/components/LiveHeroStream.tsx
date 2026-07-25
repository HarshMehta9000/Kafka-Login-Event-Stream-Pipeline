"use client";

import { useEffect, useRef, useState } from "react";
import { useSim, type Route } from "@/lib/sim";

const CLS: Record<Route, string> = {
  ios: "route-ios",
  android: "route-android",
  missing: "route-missing",
  dropped: "route-dropped",
};
const BAR: Record<Route, string> = {
  ios: "var(--ios)",
  android: "var(--android)",
  missing: "var(--missing)",
  dropped: "var(--dropped)",
};
const LABEL: Record<Route, string> = {
  ios: "iOS",
  android: "Android",
  missing: "Missing",
  dropped: "Dropped",
};

function Spark({ data }: { data: number[] }) {
  const max = Math.max(1, ...data);
  const w = 130, h = 26;
  const pts = data.map((v, i) => `${(i / Math.max(1, data.length - 1)) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-6 w-full">
      <polyline points={pts} fill="none" stroke="var(--brand)" strokeWidth={1.4} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function LiveHeroStream() {
  const { logs, counters } = useSim();
  const hist = useRef<number[]>([]);
  const [, force] = useState(0);
  useEffect(() => {
    hist.current.push(counters.perSec);
    if (hist.current.length > 36) hist.current.shift();
    force((n) => n + 1);
  }, [counters.perSec]);

  const routes: Route[] = ["ios", "android", "missing", "dropped"];
  const max = Math.max(1, counters.ios, counters.android, counters.missing, counters.dropped);
  const last = logs[0];

  return (
    <div className="surface rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-emerald-400/60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="font-mono text-[11px] text-emerald-400">LIVE</span>
        <span className="ml-auto font-mono text-[11px] text-muted">
          <span className="text-fg">{counters.perSec.toLocaleString()}</span>/s
          <span className="ml-2 text-muted">peak {counters.peakPerSec.toLocaleString()}/s</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* live routed feed */}
        <div className="rounded-lg bg-black/20 p-2 font-mono text-[10px] leading-relaxed">
          {logs.length === 0 && <div className="text-muted">waiting…</div>}
          {logs.slice(0, 6).map((l) => (
            <div key={l.id} className={`${CLS[l.route]} animate-[fadeIn_.5s_ease]`}>{l.text}</div>
          ))}
        </div>

        {/* per-route tallies */}
        <div className="space-y-1.5">
          {routes.map((r) => (
            <div key={r}>
              <div className="mb-0.5 flex items-center justify-between text-[10.5px]">
                <span className={CLS[r]}>{LABEL[r]}</span>
                <span className="font-mono text-muted">{counters[r].toLocaleString()}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-bg">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(counters[r] / max) * 100}%`, background: BAR[r] }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[9px] uppercase tracking-widest text-muted">throughput</div>
          <Spark data={hist.current.length ? hist.current : [0]} />
        </div>
        <div className="rounded-md border border-line bg-bg px-2 py-1 text-right">
          <div className="font-mono text-[9px] uppercase tracking-widest text-muted">now</div>
          <div className={`font-mono text-[11px] ${last ? CLS[last.route] : "text-muted"}`}>
            {last ? (last.route === "dropped" ? "drop null" : `→ ${last.route}`) : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
