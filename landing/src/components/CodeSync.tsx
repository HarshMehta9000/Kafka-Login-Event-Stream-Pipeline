"use client";

import { useState } from "react";
import { useSim, type Phase } from "@/lib/sim";

type Line = { t: string; phase?: Phase };

const ROUTER: Line[] = [
  { t: "from confluent_kafka import Consumer, Producer" },
  { t: "import json" },
  { t: "from datetime import datetime" },
  { t: "" },
  { t: 'TOPICS = {"iOS":"ios-user-login", "android":"android-user-login",' },
  { t: '         "missing":"missing-data-login"}' },
  { t: "EXPECTED_FIELDS = 7" },
  { t: "" },
  { t: 'consumer.subscribe(["user-login"])', phase: "poll" },
  { t: "while True:" },
  { t: "    msg = consumer.poll(1.0)", phase: "poll" },
  { t: "    raw = json.loads(msg.value())" },
  { t: "" },
  { t: "    if len(raw) != EXPECTED_FIELDS:", phase: "validate" },
  { t: '        producer.produce(TOPICS["missing"],', phase: "validate" },
  { t: '                             value=json.dumps(raw))' },
  { t: "        continue" },
  { t: "    if raw.get(\"user_id\") is None:", phase: "drop-null" },
  { t: "        continue", phase: "drop-null" },
  { t: "" },
  { t: "    raw[\"timestamp\"] = str(", phase: "transform" },
  { t: "        datetime.fromtimestamp(raw[\"timestamp\"]))", phase: "transform" },
  { t: "" },
  { t: "    topic = TOPICS.get(raw.get(\"device_type\",\"\"),", phase: "route" },
  { t: '                            TOPICS["missing"])', phase: "route" },
  { t: "    producer.produce(topic,", phase: "produce" },
  { t: "                     value=json.dumps(raw))", phase: "produce" },
];

const CONSUMER: Line[] = [
  { t: "# generic consumer: pass any topic as a CLI arg" },
  { t: "topic = sys.argv[1]" },
  { t: 'c = Consumer({"group.id": f"{topic}-group"})' },
  { t: "c.subscribe([topic])" },
  { t: "while True:" },
  { t: "    msg = c.poll(1.0)" },
  { t: "    if msg: print(msg.value().decode())" },
];

const COMPOSE: Line[] = [
  { t: "services:" },
  { t: "  zookeeper:" },
  { t: "    image: confluentinc/cp-zookeeper:latest" },
  { t: "  kafka:" },
  { t: "    image: confluentinc/cp-kafka:latest" },
  { t: "    ports: [\"29092:29092\"]" },
  { t: "  my-python-producer:" },
  { t: "    image: mpradeep954/fetch-de-data-gen" },
  { t: '    environment: {KAFKA_TOPIC: user-login}' },
];

const FILES = [
  { id: "router", name: "router.py", lines: ROUTER },
  { id: "consumer", name: "platform_consumer.py", lines: CONSUMER },
  { id: "compose", name: "docker-compose.yml", lines: COMPOSE },
];

export default function CodeSync() {
  const { phase } = useSim();
  const [tab, setTab] = useState("router");
  const file = FILES.find((f) => f.id === tab)!;

  return (
    <div className="flex h-full flex-col rounded-xl dock overflow-hidden">
      <div className="flex items-center gap-1 border-b border-white/10 px-2 py-1.5">
        {FILES.map((f) => (
          <button
            key={f.id}
            onClick={() => setTab(f.id)}
            className={`rounded px-2 py-1 font-mono text-[10.5px] transition-colors ${
              tab === f.id ? "bg-brand/15 text-brand" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {f.name}
          </button>
        ))}
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[9.5px] text-slate-500">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          live
        </span>
      </div>
      <div className="flex-1 overflow-auto p-3">
        <pre className="font-mono text-[11px] leading-[1.55]">
          {file.lines.map((l, i) => {
            const hot = tab === "router" && l.phase === phase;
            return (
              <div
                key={i}
                className={`flex gap-3 rounded px-2 transition-colors ${
                  hot ? "bg-brand/15" : ""
                }`}
              >
                <span className="w-5 select-none text-right text-slate-600">{i + 1}</span>
                <span className={`whitespace-pre ${hot ? "text-brand" : "text-slate-200"}`}>
                  {l.t || " "}
                </span>
              </div>
            );
          })}
        </pre>
      </div>
      <div className="border-t border-white/10 px-3 py-1.5 font-mono text-[9.5px] text-slate-500">
        executing: <span className="text-brand">{phase}</span>
      </div>
    </div>
  );
}
