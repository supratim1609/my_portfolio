"use client";

import { motion } from "framer-motion";
import { GlowingCard } from "./GlowingCard";

export default function TechPresence() {
  return (
    <section className="py-32 px-6 lg:px-8 bg-[#050505]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-20">
          <h2 className="text-xs font-medium tracking-widest text-[#A1A1A1] uppercase mb-6">Community Presence</h2>
          <div className="h-px w-full bg-white/[0.06]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <GlowingCard className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/[0.04] flex flex-col justify-between h-full hover:border-white/[0.12] transition-colors duration-500">
              <h3 className="text-lg font-medium text-white mb-2">Hackathon Judge</h3>
              <p className="text-[#888888] font-light text-sm leading-relaxed mb-4">
                Judged major events including Diversion 2025 & 2026, Binary 2025 & 2026, Rebase 01, and multiple other online hackathons. Professionally breaking dreams and asking "does it scale?" when it clearly doesn&apos;t.
              </p>
              <span className="text-xs font-mono text-[#A1A1A1] mt-auto">National & Online Events</span>
            </GlowingCard>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <GlowingCard className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/[0.04] flex flex-col justify-between h-full hover:border-white/[0.12] transition-colors duration-500">
              <h3 className="text-lg font-medium text-white mb-2">Tech Mentor</h3>
              <p className="text-[#888888] font-light text-sm leading-relaxed mb-4">
                Spent over 3 years actively mentoring countless developers and early-career engineers. Mostly explaining why they definitely do not need Kubernetes for their to-do app.
              </p>
              <span className="text-xs font-mono text-[#A1A1A1] mt-auto">3+ Years Mentoring</span>
            </GlowingCard>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlowingCard className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/[0.04] flex flex-col justify-between h-full hover:border-white/[0.12] transition-colors duration-500">
              <h3 className="text-lg font-medium text-white mb-2">Speaker & Sessions</h3>
              <p className="text-[#888888] font-light text-sm leading-relaxed mb-4">
                Delivered 25+ technical talks globally, including DevFest Ahlen (Germany) and Flutter India Roadshow 2024. Standing on stages and pointing confidently at architecture diagrams that are mostly lies.
              </p>
              <span className="text-xs font-mono text-[#A1A1A1] mt-auto">25+ Global Events</span>
            </GlowingCard>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
