"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import WarpingGrid from "./WarpingGrid";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

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
    <section id="home" ref={containerRef} className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-12 overflow-hidden selection:bg-white selection:text-black">
      {/* The Warping Grid Background with Parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
        <WarpingGrid />
      </motion.div>

      {/* Subtle Red Spot Glow on Mouse */}
      <motion.div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-1000 opacity-50 mix-blend-screen"
        animate={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 59, 48, 0.06), transparent 40%)`
        }}
        transition={{ type: "tween", ease: "linear", duration: 0.1 }}
      />

      <motion.div 
        className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10 w-full"
        style={{ y: textY, opacity }}
      >


        <h1 className="text-[11vw] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-medium tracking-tight text-white mb-6 sm:mb-8 leading-[1.1] sm:leading-[1.05] flex flex-wrap justify-start gap-x-3 sm:gap-x-4 gap-y-1 sm:gap-y-2">
          {words.map((word, idx) => (
            <span key={idx} className="overflow-hidden pb-2 sm:pb-4 -mb-2 sm:-mb-4">
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
          <span className="text-white font-normal">Flutter Engineer</span> who evolved into a <span className="text-white font-normal">Systems Architect</span>. I build resilient digital infrastructure, scalable backend systems, and highly secure platforms engineered to thrive under extreme reliability constraints.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex items-center flex-wrap gap-x-3 gap-y-2 text-xs sm:text-sm font-mono text-[#777777]"
        >
          {["Flutter", "Dart", "Mobile Architecture", "State Management", "Performance", "Scalability"].map((tech, i, arr) => (
            <div key={tech} className="flex items-center gap-3">
              <span className="uppercase tracking-widest hover:text-white transition-colors duration-300 cursor-default">{tech}</span>
              {i !== arr.length - 1 && <span className="text-white/[0.1]">•</span>}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
