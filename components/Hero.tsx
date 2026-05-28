"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import WarpingGrid from "./WarpingGrid";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const headline = "Supratim Dhara. Engineering the Inevitable.";
  const words = headline.split(" ");

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-12 overflow-hidden selection:bg-white selection:text-black">
      {/* The Warping Grid Background */}
      <WarpingGrid />

      {/* Subtle Red Spot Glow on Mouse */}
      <motion.div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-1000 opacity-50 mix-blend-screen"
        animate={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 59, 48, 0.06), transparent 40%)`
        }}
        transition={{ type: "tween", ease: "linear", duration: 0.1 }}
      />

      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10 w-full">


        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-medium tracking-tight text-white mb-8 leading-[1.05] flex flex-wrap justify-start gap-x-4 gap-y-2">
          {words.map((word, idx) => (
            <span key={idx} className="overflow-hidden pb-4 -mb-4">
              <motion.span
                className={`inline-block ${idx >= 2 ? "text-white/40" : ""}`}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.1 + idx * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-xl text-[#A1A1A1] max-w-2xl font-light leading-relaxed"
        >
          I design scalable digital infrastructure, AI-powered ecosystems, and other expensive buzzwords that basically mean I make sure servers don&apos;t catch fire at 3 AM.
        </motion.p>
      </div>
    </section>
  );
}
