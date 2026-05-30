"use client";

import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import Projects from "@/components/Projects";
import Manifesto from "@/components/Manifesto";
import Experience from "@/components/Experience";
import TechPresence from "@/components/TechPresence";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#050505] min-h-screen selection:bg-white selection:text-black"
    >
      <Hero />
      <Manifesto />
      <Projects />
      <Experience />
      <TechPresence />
      <Footer />
    </motion.main>
  );
}
