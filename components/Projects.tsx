'use client';

import { motion } from 'framer-motion';

const projects = [
    {
        id: "01",
        title: "Rivet Framework",
        category: "CORE_ENGINEERING",
        description: "High-performance Dart backend framework with routing, middleware, and isolates. Achieved 4x speedup vs Express.js.",
        link: "https://pub.dev/packages/rivet"
    },
    {
        id: "02",
        title: "MassArt Access",
        category: "DISTRIBUTED_SYSTEMS",
        description: "QR-based access system for 200,000+ attendees. Orchestrated Firebase, Twilio, and SES for crash-proof operations."
    },
    {
        id: "03",
        title: "BLoC Debouncer",
        category: "OPEN_SOURCE_TOOLING",
        description: "Event throttling library for Flutter BLoC pattern. Optimizes state updates and reduces unnecessary api calls.",
        link: "https://pub.dev/packages/bloc_event_debouncer"
    },
    {
        id: "04",
        title: "Escrow Payment",
        category: "FINTECH_SECURITY",
        description: "Secure multi-step payment flow with identity verification and wallet logic. Built for high-trust transactions."
    },
    {
        id: "05",
        title: "ADHD Helper",
        category: "MOBILE_PRODUCT",
        description: "Smart routine planner with behavioral reminders. Improved user task completion by 30% through verified psychology patterns."
    },
    {
        id: "06",
        title: "Liquor Delivery",
        category: "COMMERCE_LOGISTICS",
        description: "End-to-end delivery tracking solution with real-time payments and driver logistics management."
    }
];

export default function Projects() {
    return (
        <section className="relative w-full min-h-screen bg-[#121212] py-24 px-6 md:px-12 z-20">

            <div className="max-w-7xl mx-auto mb-20 flex flex-col md:flex-row justify-between items-end border-b border-white/20 pb-8">
                <div>
                    <h3 className="text-sm font-mono text-[#5FF2D6] mb-2 uppercase tracking-widest">[ Selected_Works ]</h3>
                    <h2 className="text-4xl md:text-6xl font-bold text-white font-mono uppercase leading-none">
                        System<br />Architecture
                    </h2>
                </div>
                <div className="hidden md:block text-right">
                    <p className="font-mono text-xs text-gray-500 uppercase">
                        // TOTAL_NODES: {projects.length}<br />
                        // STATUS: ONLINE
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
                {projects.map((project, index) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="group relative border border-white/10 bg-[#0a0a0a] hover:border-[#5FF2D6] transition-colors duration-300 min-h-[450px] flex flex-col justify-between p-0"
                    >
                        {/* Header Bar */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 group-hover:border-[#5FF2D6]/50 transition-colors">
                            <span className="font-mono text-xs text-gray-500 group-hover:text-[#5FF2D6]">0{project.id} // {project.category.toUpperCase().replace(/\s/g, '_')}</span>
                            <div className="w-2 h-2 bg-[#1a1a1a] group-hover:bg-[#5FF2D6] animate-pulse" />
                        </div>

                        {/* Content Area */}
                        <div className="p-8 flex-grow flex flex-col justify-center relative overflow-hidden">
                            {/* Decorative Background Grid */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none" />

                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 font-mono uppercase leading-tight group-hover:text-[#5FF2D6] transition-colors relative z-10">
                                {project.title}
                            </h3>
                            <p className="text-gray-400 font-mono text-sm leading-relaxed border-l-2 border-white/10 pl-6 group-hover:border-[#5FF2D6] transition-colors relative z-10 max-w-md">
                                {project.description}
                            </p>
                        </div>

                        {/* Footer Bar - Only if link exists */}
                        {project.link ? (
                            <a href={project.link} target="_blank" className="flex justify-between items-center px-6 py-4 border-t border-white/10 bg-white/5 group-hover:bg-[#5FF2D6]/10 transition-colors cursor-pointer">
                                <span className="font-mono text-xs text-gray-500 animate-pulse">:: VIEW_PACKAGE</span>
                                <svg className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        ) : (
                            <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02]">
                                <span className="font-mono text-xs text-gray-700">// INTERNAL_CS_LOCKED</span>
                            </div>
                        )}

                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-1 h-1 bg-white opacity-20 group-hover:bg-[#5FF2D6] group-hover:opacity-100 transition-colors" />
                        <div className="absolute top-0 right-0 w-1 h-1 bg-white opacity-20 group-hover:bg-[#5FF2D6] group-hover:opacity-100 transition-colors" />
                        <div className="absolute bottom-0 left-0 w-1 h-1 bg-white opacity-20 group-hover:bg-[#5FF2D6] group-hover:opacity-100 transition-colors" />
                        <div className="absolute bottom-0 right-0 w-1 h-1 bg-white opacity-20 group-hover:bg-[#5FF2D6] group-hover:opacity-100 transition-colors" />
                    </motion.div>
                ))}
            </div>

        </section>
    );
}
