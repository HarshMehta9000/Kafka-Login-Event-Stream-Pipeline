"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSim } from "@/lib/sim";

export default function AnomalyBanner() {
  const { counters, config, setConfig } = useSim();
  const active = config.spike || counters.anomalies > 25;
  const reason = config.spike
    ? "Traffic spike injected: brute-force pattern detected across a single IP range."
    : `Anomaly threshold breached: ${counters.anomalies} suspicious bursts.`;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="flex items-center gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[11.5px] text-amber-200"
        >
          <span className="text-base">⚠</span>
          <span className="flex-1">{reason}</span>
          <button
            onClick={() => setConfig({ spike: false })}
            className="rounded border border-amber-500/40 px-2 py-0.5 font-mono text-[10px] hover:bg-amber-500/20"
          >
            mitigate
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
