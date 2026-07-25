"use client";

import { useSim, CITIES } from "@/lib/sim";

export default function WorldMap() {
  const { geo } = useSim();
  const max = Math.max(1, ...Object.values(geo));
  const cx = 50, cy = 50;

  return (
    <div className="rounded-xl dock p-3">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">login origins</span>
        <span className="font-mono text-[9.5px] text-slate-500">simulated geo</span>
      </div>
      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg bg-black/30">
        {/* simplified landmasses */}
        <svg viewBox="0 0 100 50" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <path d="M5,18 12,12 22,14 26,22 22,30 14,32 8,28Z" fill="rgba(120,160,200,0.08)" />
          <path d="M40,10 56,9 60,16 54,24 46,22 42,16Z" fill="rgba(120,160,200,0.08)" />
          <path d="M60,20 74,22 80,30 76,40 68,42 62,34 60,26Z" fill="rgba(120,160,200,0.08)" />
          <path d="M82,12 90,14 92,22 86,26 82,20Z" fill="rgba(120,160,200,0.08)" />
          {/* cluster core */}
          <circle cx={cx} cy={cy / 2 + 25} r="1.2" fill="var(--brand)" />
          {CITIES.map((c) => {
            const count = geo[c.name] || 0;
            const r = 0.6 + (count / max) * 1.8;
            const x = c.x, y = c.y / 2;
            return (
              <g key={c.name}>
                <line x1={x} y1={y} x2={cx} y2={cy / 2 + 25} stroke="var(--brand)" strokeOpacity={0.12} strokeWidth={0.2}
                  strokeDasharray="0.6 0.8" style={{ animation: "flow-dash 1.4s linear infinite" }} />
                <circle cx={x} cy={y} r={r} fill="var(--brand)" opacity={0.5 + (count / max) * 0.5} />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
