'use client';

import { motion } from 'framer-motion';

const experiences = [
    {
        id: 1,
        role: "Cofounder & CTO",
        company: "Calvert Digital Technologies",
        period: "Jul 2025 – Present",
        description: [
            "Leading architecture for large-scale systems.",
            "Managed 200,000+ passes for MassArt Festival 2025.",
            "Orchestrated Firebase, Twilio, and SES integrations."
        ]
    },
    {
        id: 2,
        role: "Creator & Maintainer",
        company: "Rivet Backend Framework",
        period: "2025 – Present",
        description: [
            "Built a high-performance Dart backend framework.",
            "Achieved 3x speedup vs Express.js using isolates.",
            "Active open-source maintenance on pub.dev."
        ]
    },
    {
        id: 3,
        role: "Founding Engineer",
        company: "PegMan India",
        period: "Mar 2024 – May 2025",
        description: [
            "Developed production pilot app with Flutter + MVVM.",
            "Significantly improved UX/UI and app stability."
        ]
    },
    {
        id: 4,
        role: "Frontend Developer",
        company: "WaterDrops Pvt Ltd",
        period: "Aug 2023 – Sep 2023",
        description: [
            "Integrated Firebase and redesigned core UI flows.",
            "Optimized conversion funnels for mobile users."
        ]
    }
];

export default function Experience() {
    return (
        <section className="relative w-full py-32 px-6 md:px-12 bg-[#121212] z-20 overflow-hidden">
            {/* Background Grid Accent */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50" />

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="flex items-end justify-between mb-20 border-b border-white/10 pb-6">
                    <div>
                        <h3 className="text-sm font-mono text-[#CCFF00] mb-2 uppercase tracking-widest">[ SYSTEM_LOGS ]</h3>
                        <h2 className="text-4xl md:text-5xl font-bold text-white font-mono uppercase">Role_History</h2>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="font-mono text-xs text-gray-500">// CHRONOLOGICAL_ORDER_ASC</p>
                    </div>
                </div>

                <div className="relative border-l border-white/10 ml-0 md:ml-4 space-y-12">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative pl-8 md:pl-16 font-mono"
                        >
                            {/* Timeline Node */}
                            <div className="absolute -left-[5px] md:-left-[5px] top-6 w-[9px] h-[9px] bg-[#121212] border border-gray-500 group-hover:border-[#CCFF00] group-hover:bg-[#CCFF00] transition-colors duration-300 z-10" />

                            <div className="relative p-6 md:p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#CCFF00]/30 transition-all duration-300">
                                {/* Decorator Corner */}
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] text-[#CCFF00]">:: ACTIVE_NODE ::</span>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#CCFF00] transition-colors">
                                            {exp.company}
                                        </h3>
                                        <p className="text-sm md:text-base text-gray-400 mt-1 uppercase tracking-wider">
                                            // {exp.role}
                                        </p>
                                    </div>
                                    <div className="py-1 px-3 border border-white/10 rounded bg-white/5 whitespace-nowrap">
                                        <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{exp.period}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {exp.description.map((point, i) => (
                                        <div key={i} className="flex gap-3 text-sm md:text-base text-gray-400 group-hover:text-gray-300 transition-colors">
                                            <span className="text-[#CCFF00] opacity-50 group-hover:opacity-100">»</span>
                                            <p className="leading-relaxed">{point}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
