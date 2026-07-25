import ScrollProgress from "@/components/ScrollProgress";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { SimProvider } from "@/lib/sim";
import ControlRoom from "@/components/ControlRoom";
import Decisions from "@/components/Decisions";
import EventRiver3D from "@/components/EventRiver3D";
import Stack from "@/components/Stack";
import AnalyticsPanel from "@/components/AnalyticsPanel";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <SimProvider>
          <Hero />
          <ControlRoom />
          <Decisions />
          <EventRiver3D />
          <Stack />
          <AnalyticsPanel />
        </SimProvider>
        <CTA />
      </main>
      <Footer />
    </>
  );
}
