"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { KafkaIcon } from "./Icons";

const LINKS = [
  { href: "#room", label: "Control room" },
  { href: "#design", label: "Decisions" },
  { href: "#stack", label: "Stack" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled ? "border-b border-line bg-bg/85 backdrop-blur-xl" : "border-b border-transparent"}`}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#top" className="flex items-center gap-2">
          <KafkaIcon className="h-6 w-6 text-brand" />
          <span className="text-[15px] font-semibold tracking-tight">
            Kafka<span className="text-brand">Login</span> Stream
          </span>
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-[13px] text-muted transition-colors hover:text-fg">{l.label}</a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href="https://github.com/HarshMehta9000/Kafka-Login-Event-Stream-Pipeline" target="_blank" rel="noreferrer"
            className="rounded-lg bg-fg px-3.5 py-2 text-[13px] font-medium text-bg transition-opacity hover:opacity-90">GitHub</a>
        </div>
      </nav>
    </header>
  );
}
