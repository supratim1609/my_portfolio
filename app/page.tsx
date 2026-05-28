import Footer from "@/components/Footer";
import Projects from "@/components/Projects";
import Manifesto from "@/components/Manifesto";
import Experience from "@/components/Experience";
import TechPresence from "@/components/TechPresence";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="bg-[#050505] min-h-screen selection:bg-white selection:text-black">
      <Hero />
      <Manifesto />
      <Projects />
      <Experience />
      <TechPresence />
      <Footer />
    </main>
  );
}
