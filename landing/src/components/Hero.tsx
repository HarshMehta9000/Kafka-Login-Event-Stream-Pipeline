"use client";

import { motion } from "framer-motion";
import { KafkaIcon, DockerIcon, PythonIcon, ConfluentIcon } from "./Icons";
import LiveHeroStream from "./LiveHeroStream";

export default function Hero() {
  return (
    <section id="top" className="hero-glow relative overflow-hidden pt-32 pb-12 sm:pt-40">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-subtle px-3 py-1 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Real-time Kafka pipeline, routed by device platform
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.05 }}
            className="mt-5 text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Every login event, routed to the <span className="text-brand">right stream</span>, in real time.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted sm:text-lg">
            A Kafka pipeline that ingests user login events, validates each one, normalizes its
            timestamp, and routes it by device platform to iOS, Android, or missing-data topics.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#room" className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]">
              Open the control room
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
            <a href="#river" className="inline-flex items-center justify-center rounded-lg border border-line px-5 py-3 text-sm font-semibold text-fg transition-colors hover:bg-bg-subtle">
              See it fan out in 3D
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 flex items-center gap-5 text-muted">
            <span className="text-[11px] uppercase tracking-widest">stack</span>
            {[KafkaIcon, ConfluentIcon, PythonIcon, DockerIcon].map((I, i) => (
              <I key={i} className="h-5 w-5" />
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <LiveHeroStream />
          <p className="mt-2 text-center text-[11px] text-muted">
            Live routed stream, running now. Scroll for the full control room.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
