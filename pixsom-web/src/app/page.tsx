import Hero from "@/components/Hero";
import InteractiveBackground from "@/components/InteractiveBackground";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <InteractiveBackground />
      <Hero />
    </main>
  );
}
