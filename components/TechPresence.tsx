'use client';

import { motion } from 'framer-motion';

const stats = [
    { label: "Users Served", value: "200k+", desc: "Traffic handled with zero downtime" },
    { label: "Performance", value: "300%", desc: "Speedup vs standard Express.js backends" },
    { label: "Ship Speed", value: "14 Days", desc: "From concept to production delivery" },
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
                        I've delivered sessions at <strong>20+ tech summits</strong> globally, including <strong>DevFest Ahlen</strong>, <strong>Flutter India Roadshow</strong>, and <strong>GDG Kolkata/Bangladesh</strong>.
                        I also serve as a judge for numerous high-stakes hackathons like <strong>Diversion 2025</strong>, <strong>Rebase 01</strong>, and many others.
                    </p>

                    <div className="flex flex-wrap gap-4 mb-8">
                        <a href="https://www.youtube.com/live/I58UFC0EZMY?si=_fHmMbe_n8eQNqT1" target="_blank" className="group flex items-center gap-2 px-5 py-3 border border-white/20 hover:border-[#5FF2D6] bg-white/5 hover:bg-[#5FF2D6]/10 transition-all font-mono text-white text-sm">
                            <svg className="w-5 h-5 text-[#5FF2D6] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            WATCH_TALK_01
                        </a>
                        <a href="https://youtu.be/CY7yXHgQAck?si=mOiVER5DW_M5i3Xx" target="_blank" className="group flex items-center gap-2 px-5 py-3 border border-white/20 hover:border-[#5FF2D6] bg-white/5 hover:bg-[#5FF2D6]/10 transition-all font-mono text-white text-sm">
                            <svg className="w-5 h-5 text-[#5FF2D6] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            WATCH_TALK_02
                        </a>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <a
                            href="https://drive.google.com/file/d/1BNJo-xoCDvlqwTgs-FLqKZTX1019gQTR/view?usp=sharing"
                            target="_blank"
                            className="px-8 py-3 bg-[#5FF2D6] text-black font-bold hover:bg-white transition-colors font-mono uppercase text-sm border border-transparent shadow-[0_0_20px_-5px_#5FF2D6]"
                        >
                            [ View / Download CV ]
                        </a>
                        <a href="https://github.com/supratim1609" target="_blank" className="px-8 py-3 bg-white text-black font-bold hover:bg-[#5FF2D6] transition-colors font-mono uppercase text-sm border border-transparent hover:border-black/20">
                            [ GitHub ]
                        </a>
                        <a href="https://www.linkedin.com/in/supratimdhara/" target="_blank" className="px-8 py-3 border border-white/20 text-white font-bold hover:border-[#5FF2D6] hover:text-[#5FF2D6] transition-colors font-mono uppercase text-sm">
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
