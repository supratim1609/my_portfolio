"use client";

import { motion } from "framer-motion";

const EXPERIENCES = [
  {
    role: "CTO & Co-founder",
    subtitle: "(Commerce Infrastructure)",
    company: "Bechohub",
    period: "2025 — Present",
    description: "Currently building a scalable commerce ecosystem from the ground up. Directing engineering for real-time inventory management, payment gateways, and a microservices-based backend using Node.js and AWS. It's not done, but we have a domain name.",
    metrics: "Scale & Impact: Architecting for 5k+ concurrent inventory mutations/sec with a 99.99% uptime target across distributed microservices."
  },
  {
    role: "Chief Technology Officer",
    subtitle: "(Digital Transformation)",
    company: "Calverts Digital Technology",
    period: "2024 — 2025",
    description: "Led technical strategy and engineering teams to build robust digital solutions. Oversaw the development of core platforms, optimizing performance and establishing technical best practices.",
    metrics: "Scale & Impact: Scaled platform infrastructure to support 200k+ MAU while reducing average response latency by 40%."
  },
  {
    role: "Systems Engineer & Consultant",
    subtitle: "(Global Tech Ecosystems)",
    company: "Multiple Companies",
    period: "2021 — 2024",
    description: "Operated as both an in-house software engineer and a freelance consultant across various organizations. Engineered robust web applications and backend systems, driving product development from 0 to 1.",
    metrics: "Scale & Impact: Delivered 12+ enterprise-grade applications, establishing baseline Flutter and backend architectures for engineering teams of 5-15 developers."
  }
];

export default function Experience() {
  return (
    <section id="experience" className="py-32 px-6 lg:px-8 bg-[#050505]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-20">
          <h2 className="text-xs font-medium tracking-widest text-[#A1A1A1] uppercase mb-6">Experience</h2>
          <div className="h-px w-full bg-white/[0.06]" />
        </div>

        <div className="space-y-16">
          {EXPERIENCES.map((exp, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8"
            >
              <div className="md:col-span-1 text-[#888888] font-mono text-sm pt-1">
                {exp.period}
              </div>
              <div className="md:col-span-3">
                <h3 className="text-xl font-medium text-white mb-1 tracking-tight">
                  {exp.role} <span className="text-[#888888] text-sm font-normal ml-2">{exp.subtitle}</span>
                </h3>
                <h4 className="text-[#A1A1A1] font-medium mb-4">{exp.company}</h4>
                <p className="text-[#888888] font-light leading-relaxed max-w-2xl text-sm sm:text-base">
                  {exp.description}
                </p>
                {exp.metrics && (
                  <p className="text-white/[0.85] font-medium leading-relaxed max-w-2xl text-sm mt-3 border-l-2 border-white/[0.15] pl-3 py-0.5">
                    {exp.metrics}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 mb-20">
          <h2 className="text-xs font-medium tracking-widest text-[#A1A1A1] uppercase mb-6">Education</h2>
          <div className="h-px w-full bg-white/[0.06]" />
        </div>

        <div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8"
          >
            <div className="md:col-span-1 text-[#888888] font-mono text-sm pt-1">
              2021 — 2025
            </div>
            <div className="md:col-span-3">
              <h3 className="text-xl font-medium text-white mb-1 tracking-tight">Bachelor of Technology (B.Tech)</h3>
              <h4 className="text-[#A1A1A1] font-medium mb-4">University of Engineering & Management (UEM), Kolkata</h4>
              <p className="text-[#888888] font-light leading-relaxed max-w-2xl text-sm sm:text-base">
                Focused on systems engineering, software development, and modern architectural patterns.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
