"use client";

import { useSim, type Route } from "@/lib/sim";

const CLS: Record<Route, string> = {
  ios: "route-ios",
  android: "route-android",
  missing: "route-missing",
  dropped: "route-dropped",
};

export default function Console() {
  const { logs } = useSim();
  return (
    <div className="flex h-full flex-col rounded-xl dock overflow-hidden">
      <div className="border-b border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
        router stdout
      </div>
      <div className="flex-1 overflow-hidden p-3 font-mono text-[10.5px] leading-relaxed">
        {logs.length === 0 && <div className="text-slate-600">waiting for events…</div>}
        {logs.map((l) => (
          <div key={l.id} className={`${CLS[l.route]} animate-[fadeIn_.5s_ease]`}>
            <span className="text-slate-600">{String(l.id).padStart(4, "0")} </span>
            {l.text}
          </div>
        ))}
      </div>
    </div>
  );
}
