"use client";

import { useEffect, useRef, useState } from "react";
import { useSim, type Packet, type Route } from "@/lib/sim";

type Pt = { x: number; y: number };

const PRODUCER: Pt = { x: 70, y: 270 };
const TOPIC: Pt = { x: 250, y: 270 };
const ROUTER: Pt = { x: 470, y: 270 };
const IOS: Pt = { x: 690, y: 120 };
const ANDROID: Pt = { x: 690, y: 270 };
const MISSING: Pt = { x: 690, y: 420 };
const SINK: Pt = { x: 905, y: 270 };

const PATHS: Record<Route, Pt[]> = {
  ios: [PRODUCER, TOPIC, ROUTER, IOS, { x: SINK.x, y: IOS.y }],
  android: [PRODUCER, TOPIC, ROUTER, ANDROID, { x: SINK.x, y: ANDROID.y }],
  missing: [PRODUCER, TOPIC, ROUTER, MISSING, { x: SINK.x, y: MISSING.y }],
  dropped: [PRODUCER, TOPIC, ROUTER],
};

const ROUTE_FILL: Record<Route, string> = {
  ios: "var(--ios)",
  android: "var(--android)",
  missing: "var(--missing)",
  dropped: "var(--dropped)",
};

function posOnPath(pts: Pt[], p: number): Pt {
  if (pts.length === 1) return pts[0];
  const segs: number[] = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const d = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
    segs.push(d);
    total += d;
  }
  let dist = p * total;
  for (let i = 0; i < segs.length; i++) {
    if (dist <= segs[i]) {
      const t = segs[i] === 0 ? 0 : dist / segs[i];
      return {
        x: pts[i].x + (pts[i + 1].x - pts[i].x) * t,
        y: pts[i].y + (pts[i + 1].y - pts[i].y) * t,
      };
    }
    dist -= segs[i];
  }
  return pts[pts.length - 1];
}

type NodeDef = { id: string; label: string; sub: string; x: number; y: number; kind: "src" | "topic" | "proc" | "sink" };
const NODES: NodeDef[] = [
  { id: "producer", label: "Producer", sub: "my-python-producer", x: PRODUCER.x, y: PRODUCER.y, kind: "src" },
  { id: "user-login", label: "user-login", sub: "source topic", x: TOPIC.x, y: TOPIC.y, kind: "topic" },
  { id: "router", label: "Router", sub: "consumers/router.py", x: ROUTER.x, y: ROUTER.y, kind: "proc" },
  { id: "ios", label: "ios-user-login", sub: "iOS events", x: IOS.x, y: IOS.y, kind: "topic" },
  { id: "android", label: "android-user-login", sub: "Android events", x: ANDROID.x, y: ANDROID.y, kind: "topic" },
  { id: "missing", label: "missing-data-login", sub: "incomplete / null", x: MISSING.x, y: MISSING.y, kind: "topic" },
  { id: "consumers", label: "Consumers", sub: "platform_consumer.py", x: SINK.x, y: SINK.y, kind: "sink" },
];

const EDGES: [Pt, Pt, string][] = [
  [PRODUCER, TOPIC, "var(--muted)"],
  [TOPIC, ROUTER, "var(--muted)"],
  [ROUTER, IOS, "var(--ios)"],
  [ROUTER, ANDROID, "var(--android)"],
  [ROUTER, MISSING, "var(--missing)"],
  [IOS, { x: SINK.x, y: IOS.y }, "var(--ios)"],
  [ANDROID, { x: SINK.x, y: ANDROID.y }, "var(--android)"],
  [MISSING, { x: SINK.x, y: MISSING.y }, "var(--missing)"],
];

const POOL = 30;

export default function Topology({ onSelect }: { onSelect?: (id: string) => void }) {
  const { packetsRef, config } = useSim();
  const [sel, setSel] = useState<string | null>(null);
  const pool = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const pkts = packetsRef.current;
      for (let i = 0; i < POOL; i++) {
        const el = pool.current[i];
        if (!el) continue;
        const p: Packet | undefined = pkts[i];
        if (p) {
          const path = PATHS[p.route];
          const pos = posOnPath(path, Math.min(1, p.progress));
          el.setAttribute("cx", String(pos.x));
          el.setAttribute("cy", String(pos.y));
          el.style.fill = ROUTE_FILL[p.route];
          const fade = p.route === "dropped" && p.progress > 0.6 ? Math.max(0, 1 - (p.progress - 0.6) / 0.4) : 1;
          el.style.opacity = String(fade);
          const r = p.route === "dropped" ? 3.2 : 3.8;
          el.setAttribute("r", String(r));
        } else {
          el.style.opacity = "0";
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [packetsRef]);

  const click = (id: string) => {
    setSel(id);
    onSelect?.(id);
  };

  return (
    <div className="relative">
      <svg viewBox="0 0 980 540" className="w-full" role="img" aria-label="Kafka pipeline topology">
        {/* edges */}
        {EDGES.map(([a, b, c], i) => (
          <g key={i}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={c} strokeWidth={1.6} strokeOpacity={0.35} />
            <line
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={c} strokeWidth={1.8} strokeOpacity={0.7}
              strokeDasharray="4 8" style={{ animation: `flow-dash ${0.7 + (i % 3) * 0.2}s linear infinite` }}
            />
          </g>
        ))}

        {/* packets pool */}
        {Array.from({ length: POOL }).map((_, i) => (
          <circle key={i} ref={(el) => { pool.current[i] = el; }} cx={0} cy={0} r={3.6} fill="var(--brand)" opacity={0} />
        ))}

        {/* nodes */}
        {NODES.map((n) => {
          const isTopic = n.kind === "topic";
          const isProc = n.kind === "proc";
          const active = sel === n.id;
          return (
            <g key={n.id} transform={`translate(${n.x},${n.y})`} className="cursor-pointer" onClick={() => click(n.id)}>
              {active && <circle r={34} fill="var(--brand)" opacity={0.12} />}
              {isTopic ? (
                <g>
                  <ellipse cx={0} cy={-15} rx={26} ry={7} fill="none" stroke="var(--brand)" strokeOpacity={0.7} />
                  <rect x={-26} y={-15} width={52} height={30} fill="var(--canvas-2)" stroke="var(--brand)" strokeOpacity={0.5} />
                  <ellipse cx={0} cy={15} rx={26} ry={7} fill="none" stroke="var(--brand)" strokeOpacity={0.7} />
                  {/* partition ticks */}
                  {Array.from({ length: config.partitions }).map((_, p) => (
                    <line key={p} x1={-22 + p * (44 / Math.max(1, config.partitions - 1))} y1={-12} x2={-22 + p * (44 / Math.max(1, config.partitions - 1))} y2={12} stroke="var(--brand)" strokeOpacity={0.18} />
                  ))}
                </g>
              ) : (
                <rect x={-30} y={-22} width={60} height={44} rx={isProc ? 22 : 8} fill="var(--canvas-2)" stroke={isProc ? "var(--brand)" : "rgba(140,170,200,0.4)"} strokeWidth={isProc ? 1.6 : 1} />
              )}
              <text x={0} y={4} textAnchor="middle" fontSize={11} fontWeight={600} fill="#e6edf6">{n.label}</text>
              <text x={0} y={34} textAnchor="middle" fontSize={8.5} fill="#8b9bb0">{n.sub}</text>
            </g>
          );
        })}
      </svg>

      {/* node detail popover */}
      {sel && <NodeDetail id={sel} onClose={() => setSel(null)} />}
    </div>
  );
}

function NodeDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const { counters, config } = useSim();
  const map: Record<string, { title: string; code: string; metric: string }> = {
    producer: { title: "Producer", code: "produce('user-login', value=json.dumps(event))", metric: `${counters.perSec.toLocaleString()} ev/s produced` },
    "user-login": { title: "user-login topic", code: `partitions=${config.partitions}  retention=7d`, metric: `${counters.produced.toLocaleString()} total produced` },
    router: { title: "Router consumer", code: "if len(raw)!=7: -> missing\nif user_id is None: drop", metric: `${(counters.ios + counters.android).toLocaleString()} routed` },
    ios: { title: "ios-user-login", code: 'device_type == "iOS"', metric: `${counters.ios.toLocaleString()} iOS events` },
    android: { title: "android-user-login", code: 'device_type == "android"', metric: `${counters.android.toLocaleString()} Android events` },
    missing: { title: "missing-data-login", code: "len(raw) != 7  or  null fields", metric: `${counters.missing.toLocaleString()} incomplete` },
    consumers: { title: "Platform consumers", code: "python platform_consumer.py <topic>", metric: `${config.consumers} consumers  lag ${Math.round(counters.lag).toLocaleString()}` },
  };
  const d = map[id];
  if (!d) return null;
  return (
    <div className="absolute right-3 top-3 w-60 rounded-lg dock p-3 text-[11px]">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-semibold text-brand">{d.title}</span>
        <button onClick={onClose} className="text-muted hover:text-fg">✕</button>
      </div>
      <pre className="whitespace-pre-wrap break-words rounded bg-black/40 p-2 font-mono text-[10px] text-cyan-100">{d.code}</pre>
      <div className="mt-2 font-mono text-[10px] text-emerald-300">{d.metric}</div>
    </div>
  );
}
