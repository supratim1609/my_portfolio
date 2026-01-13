'use client';

import { motion } from 'framer-motion';

const stats = [
    { label: "Community", value: "2.7k+", desc: "Attendees at Cloud Community Days" },
    { label: "Writing", value: "500+", desc: "Developers read my technical blogs" },
    { label: "Speed", value: "3x", desc: "Faster backend response with Rivet" },
];

export default function TechPresence() {
    return (
        <section className="relative w-full py-24 px-6 md:px-12 bg-[#121212] z-20 border-t border-white/5">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left: Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-sm font-mono text-purple-400 mb-4 uppercase tracking-widest">Tech Presence</h3>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono">
                        Speaker, Judge & <br /> Open Source Creator.
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed mb-8 font-mono">
                        I actively shape the ecosystem. I organized <strong>Cloud Community Days Kolkata</strong> (2700+ attendees).
                        I've delivered sessions at <strong>DevFest Ahlen</strong>, <strong>Flutter India Roadshow</strong>, and <strong>GDG Kolkata/Bangladesh</strong>.
                        I also serve as a judge for high-stakes hackathons like <strong>Diversion 2025</strong> and <strong>Rebase 01</strong>.
                    </p>

                    <div className="flex flex-wrap gap-4 mb-8">
                        <a href="https://www.youtube.com/live/I58UFC0EZMY?si=_fHmMbe_n8eQNqT1" target="_blank" className="group flex items-center gap-2 px-5 py-3 border border-white/20 hover:border-[#CCFF00] bg-white/5 hover:bg-[#CCFF00]/10 transition-all font-mono text-white text-sm">
                            <span className="text-[#CCFF00] group-hover:text-white">▶</span> WATCH_TALK_01
                        </a>
                        <a href="https://youtu.be/CY7yXHgQAck?si=mOiVER5DW_M5i3Xx" target="_blank" className="group flex items-center gap-2 px-5 py-3 border border-white/20 hover:border-[#CCFF00] bg-white/5 hover:bg-[#CCFF00]/10 transition-all font-mono text-white text-sm">
                            <span className="text-[#CCFF00] group-hover:text-white">▶</span> WATCH_TALK_02
                        </a>
                    </div>

                    <div className="flex gap-4">
                        <a href="https://github.com/supratim1609" target="_blank" className="px-8 py-3 bg-white text-black font-bold hover:bg-[#CCFF00] transition-colors font-mono uppercase text-sm border border-transparent hover:border-black/20">
                            [ GitHub ]
                        </a>
                        <a href="https://www.linkedin.com/in/supratimdhara/" target="_blank" className="px-8 py-3 border border-white/20 text-white font-bold hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors font-mono uppercase text-sm">
                            [ LinkedIn ]
                        </a>
                    </div>
                </motion.div>

                {/* Right: Bento Grid Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className={`p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm ${i === 0 ? 'sm:col-span-2' : ''}`}
                        >
                            <h4 className="text-5xl font-bold text-white mb-2 font-mono">{stat.value}</h4>
                            <p className="text-lg font-semibold text-gray-200 font-mono">{stat.label}</p>
                            <p className="text-sm text-gray-400 font-mono">{stat.desc}</p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
