"use client";

import { KafkaIcon, ConfluentIcon, PythonIcon, DockerIcon } from "./Icons";

const STACK = [
  { Icon: KafkaIcon, name: "Apache Kafka", role: "message broker" },
  { Icon: ConfluentIcon, name: "Confluent Python", role: "producer / consumer" },
  { Icon: PythonIcon, name: "Python 3.8+", role: "routing logic" },
  { Icon: DockerIcon, name: "Docker Compose", role: "broker + producer" },
];

export default function Stack() {
  return (
    <section id="stack" className="border-t border-line bg-bg-subtle">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-24 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-brand">/ stack</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">A small, deliberate stack.</h2>
          <p className="mt-4 max-w-md text-muted">
            Each tool does one job. The broker and producer are containerized for consistent
            networking, while the router and consumers stay as lightweight Python you can watch and
            iterate on locally.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {STACK.map((s) => (
              <div key={s.name} className="flex items-center gap-3 rounded-xl border border-line bg-bg px-3 py-3">
                <s.Icon className="h-6 w-6 text-fg/80" />
                <div>
                  <div className="text-[13px] font-medium">{s.name}</div>
                  <div className="font-mono text-[10px] uppercase tracking-wide text-muted">{s.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-[#0b0f17]">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono text-[11px] text-white/40">terminal</span>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-[12px] leading-relaxed text-white/85">
            <code>
              <span className="text-emerald-400">$</span> docker-compose up -d{"\n"}
              <span className="text-slate-500">  zookeeper  kafka  my-python-producer  started</span>
              {"\n"}
              <span className="text-emerald-400">$</span> python consumers/router.py{"\n"}
              <span className="text-slate-500">  Router listening on 'user-login'</span>
              {"\n\n"}
              <span className="text-cyan-300">[    IOS]</span>  user=abc123  dev=iOS  v2.3.0{"\n"}
              <span className="text-emerald-300">[ANDROID]</span>  user=def456  dev=android{"\n"}
              <span className="text-amber-300">[MISSING]</span>  {"{user_id:ghi789, ..incomplete}"}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}
