"use client";

export default function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-bg-subtle px-6 py-14 text-center sm:px-12">
        <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-brand/10 blur-3xl" />
        <h2 className="relative text-3xl font-semibold tracking-tight sm:text-4xl">Run the pipeline locally.</h2>
        <p className="relative mx-auto mt-4 max-w-xl text-muted">
          Bring up Kafka, Zookeeper, and the producer in containers, then start the router and watch
          events classify and route in real time.
        </p>
        <pre className="relative mx-auto mt-8 inline-block rounded-lg border border-line bg-bg px-4 py-2 text-left font-mono text-xs text-muted">
          <span className="text-brand">$</span> docker-compose up -d{"\n"}
          <span className="text-brand">$</span> python consumers/router.py
        </pre>
        <div className="relative mt-8">
          <a href="https://github.com/HarshMehta9000/Kafka-Login-Event-Stream-Pipeline" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 .5C5.4.5 0 5.9 0 12.5c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 24 12.5C24 5.9 18.6.5 12 .5Z" /></svg>
            Clone on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
