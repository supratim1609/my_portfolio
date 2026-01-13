'use client';

import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <footer className="w-full bg-[#050505] pt-24 pb-12 z-20 relative overflow-hidden text-white border-t border-white/5">

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 mb-24">

                    {/* Column 1: Call to Action */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-mono text-gray-500 uppercase tracking-widest">// NEXT_STEP</h3>
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight font-mono">
                            Time to build<br />something<br /><span className="text-[#5FF2D6]">remarkable.</span>
                        </h2>
                        <a
                            href="mailto:supratimdhara0@gmail.com"
                            className="inline-block mt-8 text-lg border-b border-[#5FF2D6] pb-1 hover:text-[#5FF2D6] transition-colors font-mono"
                        >
                            supratimdhara0@gmail.com
                        </a>
                    </div>

                    {/* Column 2: Navigation / Socials */}
                    <div className="md:col-start-2 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-6">_CONNECT</h3>
                            <ul className="space-y-4 font-mono text-sm">
                                <li>
                                    <a href="https://linkedin.com/in/supratimdhara/" target="_blank" className="hover:text-[#5FF2D6] transition-colors flex items-center gap-2">
                                        LinkedIn <span className="text-gray-600">↗</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://github.com/supratim1609" target="_blank" className="hover:text-[#5FF2D6] transition-colors flex items-center gap-2">
                                        GitHub <span className="text-gray-600">↗</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://medium.com/@supratimdhara0" target="_blank" className="hover:text-[#5FF2D6] transition-colors flex items-center gap-2">
                                        Medium <span className="text-gray-600">↗</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.instagram.com/dhara_apk/" target="_blank" className="hover:text-[#5FF2D6] transition-colors flex items-center gap-2">
                                        Instagram <span className="text-gray-600">↗</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Column 3: System Status */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-6">_STATUS</h3>
                            <div className="font-mono text-xs text-gray-400 space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-[#5FF2D6] rounded-full animate-pulse" />
                                    <span className="text-[#5FF2D6]">AVAILABLE FOR HIRE</span>
                                </div>
                                <p>LOC: KOLKATA, INDIA</p>
                                <p>TZ: GMT+5:30</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 font-mono text-xs text-gray-600">
                    <p>© {new Date().getFullYear()} Supratim Dhara</p>
                    <p className="mt-2 md:mt-0 uppercase tracking-wider">Designed & Engineered</p>
                </div>
            </div>

        </footer>
    );
}
