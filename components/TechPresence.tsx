"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { GlowingCard } from "./GlowingCard";
import { VideoModal } from "./VideoModal";

const FEATURED_SESSIONS = [
  {
    id: "I58UFC0EZMY",
    title: "Tech Talk: Building Resilient Architecture",
    type: "Live Stream"
  },
  {
    id: "CY7yXHgQAck",
    title: "Session: Scaling the Inevitable",
    type: "Conference Talk"
  }
];

export default function TechPresence() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section id="presence" className="py-32 px-6 lg:px-8 bg-[#050505]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-20">
          <h2 className="text-xs font-medium tracking-widest text-[#A1A1A1] uppercase mb-6">Community Presence</h2>
          <div className="h-px w-full bg-white/[0.06]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="h-full"
          >
            <GlowingCard className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/[0.04] flex flex-col justify-between h-full hover:border-white/[0.12] transition-colors duration-500">
              <h3 className="text-lg font-medium text-white mb-2">Hackathon Judge</h3>
              <p className="text-[#888888] font-light text-sm leading-relaxed mb-4">
                Judged major events including Diversion 2025 & 2026, Binary 2025 & 2026, Rebase 01, and multiple other online hackathons. Professionally breaking dreams and asking &quot;does it scale?&quot; when it clearly doesn&apos;t.
              </p>
              <span className="text-xs font-mono text-[#A1A1A1] mt-auto">National & Online Events</span>
            </GlowingCard>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="h-full"
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
            className="h-full"
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

        <div className="mb-20">
          <h2 className="text-xs font-medium tracking-widest text-[#A1A1A1] uppercase mb-6">Featured Sessions</h2>
          <div className="h-px w-full bg-white/[0.06]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURED_SESSIONS.map((session, idx) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="h-full"
            >
              <div 
                onClick={() => setActiveVideo(session.id)}
                className="cursor-pointer h-full"
              >
                <GlowingCard className="group flex flex-col justify-between p-2 rounded-3xl bg-[#0A0A0A] border border-white/[0.04] hover:border-white/[0.12] transition-colors duration-500 h-full">
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#111] mb-6">
                    {/* Thumbnail */}
                    <img 
                      src={`https://img.youtube.com/vi/${session.id}/maxresdefault.jpg`} 
                      alt={session.title}
                      className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out transform group-hover:scale-105"
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-[#FF3B30] group-hover:border-[#FF3B30] transition-colors duration-500">
                        <svg className="w-6 h-6 text-white translate-x-[2px]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 pb-6">
                    <p className="text-xs font-mono text-[#A1A1A1] mb-2 uppercase tracking-wider">{session.type}</p>
                    <h3 className="text-xl font-medium text-white tracking-tight">{session.title}</h3>
                  </div>
                </GlowingCard>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      <VideoModal 
        isOpen={!!activeVideo} 
        videoId={activeVideo} 
        onClose={() => setActiveVideo(null)} 
      />
    </section>
  );
}
