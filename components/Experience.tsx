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
        <section className="relative w-full py-24 px-6 md:px-12 bg-[#121212] z-20 border-t border-white/5">
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold text-white mb-16 text-center font-mono"
                >
                    Experience
                </motion.h2>

                <div className="space-y-12">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex flex-col md:flex-row gap-4 md:gap-12 pb-12 border-b border-white/5 last:border-0"
                        >
                            <div className="md:w-1/3">
                                <h3 className="text-xl font-bold text-white font-mono">{exp.company}</h3>
                                <p className="text-sm text-gray-500 font-mono mt-1">{exp.period}</p>
                            </div>
                            <div className="md:w-2/3">
                                <h4 className="text-lg font-semibold text-gray-200 mb-2 font-mono">{exp.role}</h4>
                                <ul className="list-disc list-outside ml-4 space-y-2">
                                    {exp.description.map((point, i) => (
                                        <li key={i} className="text-gray-400 text-sm leading-relaxed font-mono">{point}</li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
