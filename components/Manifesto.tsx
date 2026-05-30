"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const text1 = "I believe that great software should feel inevitable. It rarely does. It usually feels like layers of duct tape holding back an ocean of panic.";
const text2 = "I spend my time at the intersection of systems engineering and product design—trying to build infrastructure that actually survives contact with real users without waking me up.";

const splitWords = (text: string) => {
  return text.split(" ").map((word, index) => {
    // Highlight specific words
    const isHighlighted = 
      word.includes("inevitable.") || 
      word.includes("systems") || 
      word.includes("engineering") || 
      word.includes("product") || 
      word.includes("design—trying");
    
    return (
      <motion.span
        key={index}
        className={`inline-block mr-2 ${isHighlighted ? "text-white font-medium" : ""}`}
        variants={{
          hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)" }
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {word}
      </motion.span>
    );
  });
};

export default function Manifesto() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 lg:px-8 relative bg-[#050505] border-t border-white/[0.04]">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <div className="space-y-8">
          <motion.p 
            className="text-2xl sm:text-3xl md:text-4xl font-light text-[#888888] leading-[1.4] tracking-tight mb-12 flex flex-wrap"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
              visible: { transition: { staggerChildren: 0.03 } }
            }}
          >
            {splitWords(text1)}
          </motion.p>
          <motion.p 
            className="text-2xl sm:text-3xl md:text-4xl font-light text-[#888888] leading-[1.4] tracking-tight flex flex-wrap"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
              visible: { transition: { staggerChildren: 0.03, delayChildren: 0.4 } }
            }}
          >
            {splitWords(text2)}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
