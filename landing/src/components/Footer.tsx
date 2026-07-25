import { KafkaIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <KafkaIcon className="h-5 w-5 text-brand" />
          <span className="text-[13px] text-muted">Kafka <span className="text-brand">Login</span> Event Stream Pipeline, MIT License</span>
        </div>
        <div className="flex items-center gap-5 text-[13px] text-muted">
          <a className="transition-colors hover:text-fg" href="#room">Control room</a>
          <a className="transition-colors hover:text-fg" href="#design">Decisions</a>
          <a className="transition-colors hover:text-fg" href="https://github.com/HarshMehta9000/Kafka-Login-Event-Stream-Pipeline" target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>
      </div>
    </footer>
  );
}
