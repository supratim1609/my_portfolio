"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GlowingCard } from "./GlowingCard";
import { useState } from "react";

const PROJECTS = [
  {
    title: "Elections Observer App",
    description: "A highly secure, offline-first civic technology platform utilized for critical observation protocols during democratic processes. Engineered for absolute resilience under extreme reliability constraints.",
    role: "Mobile Lead",
    link: "#",
    breakdown: [
      { label: "Architecture", value: "Offline-first with local SQLite and a background sync queue utilizing WorkManager." },
      { label: "Tradeoffs", value: "Sacrificed immediate global data consistency for 100% availability during severe network partitions." },
      { label: "Resilience", value: "Implemented exponential backoff and payload chunking for reliable synchronization in low-bandwidth areas." }
    ]
  },
  {
    title: "Rivet Framework",
    description: "A robust backend framework built entirely on Dart. Designed to provide scalable infrastructure and deterministic execution for modern, high-performance applications.",
    role: "Creator",
    link: "https://supratim1609.github.io/rivet_landing/",
    breakdown: [
      { label: "Architecture", value: "Multi-isolate async architecture leveraging Dart's advanced concurrency primitives." },
      { label: "Tradeoffs", value: "Engineered a custom, zero-dependency routing layer to eliminate ecosystem bloat at the cost of higher initial R&D." },
      { label: "Performance", value: "Deterministic memory management tuned for consistent P99 latency under heavy I/O load." }
    ]
  },
  {
    title: "Bechohub Commerce",
    description: "A comprehensive commerce ecosystem providing core digital infrastructure for modern merchants. Managing engineering for real-time inventory and microservices architecture.",
    role: "CTO & Co-founder",
    link: "https://www.bechohub.com/",
    breakdown: [
      { label: "Architecture", value: "Distributed microservices (Node.js/PostgreSQL) orchestrated on AWS, with Redis for real-time inventory caching." },
      { label: "Tradeoffs", value: "Embraced eventual consistency across inventory replicas to maximize read/write throughput during flash sales." },
      { label: "Failure Handling", value: "Strict circuit breakers and fallback queues on 3rd-party payment gateway integrations." }
    ]
  }
];

function ProjectCard({ project, idx }: { project: typeof PROJECTS[0], idx: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <GlowingCard className="group flex flex-col justify-between p-8 rounded-3xl bg-[#0A0A0A] border border-white/[0.04] hover:border-white/[0.12] transition-colors duration-500 h-full">
        <div>
          <p className="text-xs font-mono text-[#A1A1A1] mb-6 uppercase tracking-wider">{project.role}</p>
          <h3 className="text-2xl font-medium text-white mb-4 tracking-tight">{project.title}</h3>
          <p className="text-[#888888] font-light leading-relaxed text-sm">
            {project.description}
          </p>
        </div>
        
        <div className="mt-8 flex flex-col justify-end flex-grow">
          <div className="border-t border-white/[0.04] pt-6 mt-auto">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-between w-full text-xs font-mono text-[#A1A1A1] hover:text-white transition-colors duration-300 uppercase tracking-wider group/btn"
            >
              <span>Engineering Breakdown</span>
              <svg 
                className={`w-4 h-4 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : 'group-hover/btn:text-white'}`} 
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 space-y-4">
                    {project.breakdown.map((item, i) => (
                      <div key={i} className="text-sm">
                        <span className="text-white font-medium block mb-1">{item.label}</span>
                        <span className="text-[#888888] font-light leading-relaxed">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {project.link !== "#" && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center text-[#A1A1A1] hover:text-white transition-colors duration-300 w-fit group/link">
              <span className="text-sm font-medium mr-2">Visit Platform</span>
              <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          )}
        </div>
      </GlowingCard>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="work" className="py-32 px-6 lg:px-8 bg-[#050505]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-20">
          <h2 className="text-xs font-medium tracking-widest text-[#A1A1A1] uppercase mb-6">Selected Work</h2>
          <div className="h-px w-full bg-white/[0.06]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, idx) => (
            <ProjectCard key={idx} project={project} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
