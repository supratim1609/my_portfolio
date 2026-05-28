"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

export default function Manifesto() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 lg:px-8 relative bg-[#050505] border-t border-white/[0.04]">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <p className="text-2xl sm:text-3xl md:text-4xl font-light text-[#888888] leading-[1.4] tracking-tight mb-12">
            I believe that great software should feel <span className="text-white font-medium">inevitable</span>. It rarely does. It usually feels like layers of duct tape holding back an ocean of panic.
          </p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-light text-[#888888] leading-[1.4] tracking-tight">
            I spend my time at the intersection of <span className="text-white font-medium">systems engineering</span> and <span className="text-white font-medium">product design</span>—trying to build infrastructure that actually survives contact with real users without waking me up.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
