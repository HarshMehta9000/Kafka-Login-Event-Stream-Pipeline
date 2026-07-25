"use client";

import Topology from "./Topology";
import CodeSync from "./CodeSync";
import Controls from "./Controls";
import Metrics from "./Metrics";
import Console from "./Console";
import WorldMap from "./WorldMap";
import AnomalyBanner from "./AnomalyBanner";

export default function ControlRoom() {
  return (
    <section id="room" className="mx-auto max-w-6xl px-5 py-20">
      <div className="mb-8 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-brand">/ live control room</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Watch every login event route itself.</h2>
        <p className="mt-4 text-muted">
          A live simulation of the pipeline at scale. Tune the producer rate, partition count, and
          consumer parallelism, then fire chaos at it. The real <span className="font-mono text-fg">router.py</span> on the
          right highlights the line executing for each event.
        </p>
      </div>

      <div className="ops ops-grid rounded-2xl border border-white/10 p-3 sm:p-4">
        <AnomalyBanner />

        <div className="mt-3 grid gap-3 lg:grid-cols-[200px_1fr_310px]">
          <Controls />

          <div className="space-y-3">
            <div className="rounded-xl dock p-2">
              <Topology />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Console />
              <WorldMap />
            </div>
          </div>

          <CodeSync />
        </div>

        <div className="mt-3">
          <Metrics />
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] text-muted">
        Click any node in the topology to inspect its code and live counters. Slide produce rate past consumer capacity to grow lag.
      </p>
    </section>
  );
}
