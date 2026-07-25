import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: "Kafka Login Event Stream Pipeline — Live Routing Control Room",
  description:
    "Real-time Kafka pipeline that streams user login events and routes each by device platform (iOS, Android, missing data). An interactive control room simulating the live topology, throughput, and routing logic at scale.",
  keywords: ["Kafka", "Confluent", "streaming", "event pipeline", "router", "consumer", "data engineering"],
  openGraph: {
    title: "Kafka Login Event Stream Pipeline",
    description: "Live routing control room for a real-time Kafka login-event pipeline.",
    type: "website",
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrains.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
