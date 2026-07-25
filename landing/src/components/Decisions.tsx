"use client";

const DECISIONS = [
  {
    q: "One generic consumer, not three?",
    a: "platform_consumer.py replaces ios / android / missing scripts. Same logic, takes the topic as a CLI arg. Less duplication.",
  },
  {
    q: "Route in a consumer, not Kafka Streams?",
    a: "Routing is a 10-line if/else on one field. A plain consumer and producer have far fewer dependencies than a Streams app for logic this simple.",
  },
  {
    q: "Docker for infra, local for consumers?",
    a: "The broker and producer need consistent networking, so Docker fits. Consumers are lightweight Python you want to watch and iterate on locally.",
  },
];

const SCALE = [
  ["Schema Registry", "Enforce Avro/Protobuf to catch schema drift before consumers."],
  ["Dead-letter queue", "Route unparseable messages to a DLQ instead of dropping them."],
  ["Lag monitoring", "Prometheus + Grafana on consumer group offsets."],
  ["Key partitioning", "Partition by user_id hash for per-user ordering."],
  ["Sink connector", "Kafka Connect into a warehouse for historical analytics."],
];

export default function Decisions() {
  return (
    <section id="design" className="mx-auto max-w-6xl px-5 py-24">
      <div className="mb-10 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-brand">/ engineering calls</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Decisions, with reasons.</h2>
        <p className="mt-4 text-muted">The same tradeoffs the repo documents, surfaced as architecture decisions.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {DECISIONS.map((d) => (
          <div key={d.q} className="surface rounded-2xl p-5">
            <div className="mb-2 inline-flex rounded-md bg-brand-soft px-2 py-0.5 font-mono text-[10px] text-brand">ADR</div>
            <h3 className="text-[15px] font-semibold">{d.q}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">{d.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 surface rounded-2xl p-6">
        <h3 className="text-[15px] font-semibold">What I would add at scale</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {SCALE.map(([t, d]) => (
            <div key={t} className="rounded-xl border border-line bg-bg p-3">
              <div className="text-[13px] font-medium">{t}</div>
              <div className="mt-1 text-[11.5px] leading-snug text-muted">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
