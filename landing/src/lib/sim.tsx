"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type Route = "ios" | "android" | "missing" | "dropped";
export type Phase = "poll" | "validate" | "drop-null" | "transform" | "route" | "produce";

export type Config = {
  rate: number; // events/sec (logical)
  partitions: number;
  consumers: number;
  schemaStrict: boolean;
  spike: boolean;
  killConsumer: boolean;
  paused: boolean;
};

export type Counters = {
  produced: number;
  ios: number;
  android: number;
  missing: number;
  dropped: number;
  anomalies: number;
  lag: number;
  latencyMs: number;
  perSec: number;
  peakPerSec: number;
  interactions: number;
};

export type Packet = { id: number; route: Route; progress: number };

export const CITIES = [
  { name: "San Francisco", x: 17, y: 38 },
  { name: "New York", x: 27, y: 36 },
  { name: "London", x: 47, y: 30 },
  { name: "Berlin", x: 51, y: 29 },
  { name: "Singapore", x: 74, y: 57 },
  { name: "Tokyo", x: 84, y: 39 },
  { name: "Sydney", x: 88, y: 74 },
  { name: "São Paulo", x: 34, y: 70 },
  { name: "Mumbai", x: 66, y: 49 },
];

const DEFAULT_CFG: Config = {
  rate: 120,
  partitions: 6,
  consumers: 3,
  schemaStrict: false,
  spike: false,
  killConsumer: false,
  paused: false,
};

type Ctx = {
  config: Config;
  setConfig: (patch: Partial<Config>) => void;
  counters: Counters;
  logs: { id: number; route: Route; text: string }[];
  phase: Phase;
  geo: Record<string, number>;
  packetsRef: React.MutableRefObject<Packet[]>;
};

const SimContext = createContext<Ctx | null>(null);

const USERS = ["abc123", "def456", "ghi789", "jkl012", "mno345", "pqr678", "stu901", "vwx234"];
const VERS = ["2.3.0", "2.3.1", "2.4.0", "2.2.5"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function decideRoute(cfg: Config): { route: Route; device: string } {
  // anomaly burst while spiking
  if (cfg.spike && Math.random() < 0.12) {
    return { route: Math.random() < 0.5 ? "ios" : "android", device: Math.random() < 0.5 ? "iOS" : "android" };
  }
  const r = Math.random();
  if (r < 0.018) return { route: "dropped", device: "null" };
  if (r < 0.08) return { route: "missing", device: "unknown" };
  if (cfg.schemaStrict && Math.random() < 0.05) return { route: "missing", device: "unknown" };
  if (r < 0.54) return { route: "ios", device: "iOS" };
  return { route: "android", device: "android" };
}

export function SimProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<Config>(DEFAULT_CFG);
  const cfgRef = useRef(config);
  cfgRef.current = config;

  const countersRef = useRef<Counters>({
    produced: 0, ios: 0, android: 0, missing: 0, dropped: 0, anomalies: 0, lag: 0, latencyMs: 14, perSec: 0, peakPerSec: 0, interactions: 0,
  });
  const packetsRef = useRef<Packet[]>([]);
  const logRef = useRef<{ id: number; route: Route; text: string }[]>([]);
  const phaseRef = useRef<Phase>("poll");
  const geoRef = useRef<Record<string, number>>({});

  const [counters, setCounters] = useState<Counters>(countersRef.current);
  const [logs, setLogs] = useState<typeof logRef.current>([]);
  const [phase, setPhase] = useState<Phase>("poll");
  const [geo, setGeo] = useState<Record<string, number>>({});

  const setConfig = (patch: Partial<Config>) => {
    countersRef.current.interactions++;
    setConfigState((c) => ({ ...c, ...patch }));
  }

  // engine loop (rAF)
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let spawnAcc = 0;
    let lastVisual = 0;
    let secAcc = 0;
    let producedThisSec = 0;
    let pid = 1;
    let lid = 1;
    let feedAcc = 0;
    let lastSpawn: { route: Route; device: string; user: string } = { route: "ios", device: "iOS", user: "abc123" };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const cfg = cfgRef.current;

      if (!cfg.paused && typeof document !== "undefined" && !document.hidden) {
        // spawn logical events
        spawnAcc += cfg.rate * dt;
        let guard = 0;
        while (spawnAcc >= 1 && guard < 400) {
          spawnAcc -= 1;
          guard++;
          producedThisSec++;
          const c = countersRef.current;
          c.produced++;
          const { route, device } = decideRoute(cfg);
          if (route === "ios") c.ios++;
          else if (route === "android") c.android++;
          else if (route === "missing") c.missing++;
          else c.dropped++;
          if (cfg.spike && Math.random() < 0.04) c.anomalies++;

          // geo
          const city = pick(CITIES);
          geoRef.current[city.name] = (geoRef.current[city.name] || 0) + 1;

          // phase reflects the routing decision
          if (route === "dropped") phaseRef.current = "drop-null";
          else if (route === "missing") phaseRef.current = "validate";
          else phaseRef.current = "route";

          // visual packet (throttled ~22/s)
          if (now - lastVisual > 1000 / 22) {
            lastVisual = now;
            const pkts = packetsRef.current;
            pkts.push({ id: pid++, route, progress: 0 });
            if (pkts.length > 30) pkts.shift();
          }

          // remember the latest event for the slow feed ticker
          lastSpawn = { route, device, user: route === "dropped" ? "null" : pick(USERS) };
        }

        // advance packets (slow, flowing glide)
        const pkts = packetsRef.current;
        for (let i = pkts.length - 1; i >= 0; i--) {
          pkts[i].progress += dt * 0.6;
          if (pkts[i].progress > 1.05) pkts.splice(i, 1);
        }

        // slow, readable feed ticker (one line every 0.8s) instead of per-event strobing
        feedAcc += dt;
        if (feedAcc >= 0.8) {
          feedAcc = 0;
          const ls = lastSpawn;
          const tag = ls.route === "ios" ? "IOS" : ls.route === "android" ? "ANDROID" : ls.route === "missing" ? "MISSING" : "DROP";
          const extra =
            ls.route === "missing" ? `{user_id:${ls.user}, ..incomplete}` :
            ls.route === "dropped" ? `user=null (skipped)` :
            `user=${ls.user} dev=${ls.device} v${pick(VERS)}`;
          logRef.current.unshift({ id: lid++, route: ls.route, text: `[${tag}] ${extra}` });
          if (logRef.current.length > 8) logRef.current.pop();
        }

        // lag + latency model
        const effConsumers = Math.max(1, cfg.consumers - (cfg.killConsumer ? 1 : 0));
        const capacity = effConsumers * 1400;
        const target = Math.max(0, (cfg.rate - capacity) * 0.6);
        c_lag(countersRef.current, target, dt);
        countersRef.current.latencyMs = Math.round(10 + countersRef.current.lag * 0.05 + cfg.partitions * 0.6);

        // per-second sampling
        secAcc += dt;
        if (secAcc >= 1) {
          countersRef.current.perSec = producedThisSec;
          if (producedThisSec > countersRef.current.peakPerSec)
            countersRef.current.peakPerSec = producedThisSec;
          producedThisSec = 0;
          secAcc = 0;
        }
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // low-frequency UI snapshot (2Hz, calm)
  useEffect(() => {
    const id = setInterval(() => {
      setCounters({ ...countersRef.current });
      setLogs([...logRef.current]);
      setPhase(phaseRef.current);
      setGeo({ ...geoRef.current });
    }, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <SimContext.Provider value={{ config, setConfig, counters, logs, phase, geo, packetsRef }}>
      {children}
    </SimContext.Provider>
  );
}

function c_lag(c: Counters, target: number, dt: number) {
  const k = target > c.lag ? 1.2 : 2.4;
  c.lag += (target - c.lag) * Math.min(1, dt * k);
  c.lag = Math.max(0, c.lag);
}

export function useSim() {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error("useSim must be used within SimProvider");
  return ctx;
}
