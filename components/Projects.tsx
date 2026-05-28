"use client";

import { motion } from "framer-motion";
import { GlowingCard } from "./GlowingCard";

const PROJECTS = [
  {
    title: "Bechohub Commerce",
    description: "A comprehensive commerce ecosystem enabling digital infrastructure for modern merchants. Currently building it, but hey, the domain works.",
    role: "Founder & Architect",
    link: "https://www.bechohub.com/",
  },
  {
    title: "Rivet Framework",
    description: "A robust backend framework built entirely on Dart. Designed to provide scalable infrastructure and deterministic execution for modern applications.",
    role: "Creator",
    link: "https://supratim1609.github.io/rivet_landing/",
  },
  {
    title: "Elections Observer App",
    description: "A secure, offline-first civic technology platform used for critical observation protocols during democratic processes. Built with extreme reliability constraints.",
    role: "Mobile Lead",
    link: "#",
  }
];

export default function Projects() {
  return (
    <section className="py-32 px-6 lg:px-8 bg-[#050505]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-20">
          <h2 className="text-xs font-medium tracking-widest text-[#A1A1A1] uppercase mb-6">Selected Work</h2>
          <div className="h-px w-full bg-white/[0.06]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlowingCard className="group flex flex-col justify-between p-8 rounded-3xl bg-[#0A0A0A] border border-white/[0.04] hover:border-white/[0.12] transition-colors duration-500 h-full">
                <div>
                  <p className="text-xs font-mono text-[#A1A1A1] mb-6 uppercase tracking-wider">{project.role}</p>
                  <h3 className="text-2xl font-medium text-white mb-4 tracking-tight">{project.title}</h3>
                  <p className="text-[#888888] font-light leading-relaxed text-sm">
                    {project.description}
                  </p>
                </div>
                
                {project.link !== "#" && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="mt-12 flex items-center text-[#A1A1A1] group-hover:text-white transition-colors duration-300">
                    <span className="text-sm font-medium mr-2">Visit Platform</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                )}
              </GlowingCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
