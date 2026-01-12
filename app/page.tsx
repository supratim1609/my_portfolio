import Footer from "@/components/Footer";
import Projects from "@/components/Projects";
import ScrollyCanvas from "@/components/ScrollyCanvas";
import Experience from "@/components/Experience";
import TechPresence from "@/components/TechPresence";

export default function Home() {
  return (
    <main className="bg-[#121212] min-h-screen">
      <ScrollyCanvas />
      <Experience />
      <Projects />
      <TechPresence />
      <Footer />
    </main>
  );
}
