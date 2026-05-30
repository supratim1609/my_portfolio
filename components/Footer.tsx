"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Footer() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["50px", "0px"]);

  return (
    <footer ref={containerRef} className="bg-[#050505] pt-32 pb-12 px-6 lg:px-8 overflow-hidden relative">
      {/* Blended Background Massive CTA */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none select-none z-0">
        <motion.div
          style={{ scale, y }}
          className="w-full text-center"
        >
          <h2 className="text-[15vw] font-bold text-white tracking-tighter leading-none whitespace-nowrap opacity-[0.02]">
            LET&apos;S BUILD.
          </h2>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto flex justify-center items-center pb-24 border-b border-white/[0.04]">
        <a href="mailto:supratimdhara0@gmail.com" className="group relative inline-block">
          <h2 className="text-[6vw] sm:text-[4vw] font-medium text-white tracking-tight opacity-50 group-hover:opacity-100 transition-opacity duration-700">
            Start a project
          </h2>
          {/* Subtle ghostly glow that tracks behind text */}
          <div className="absolute inset-0 -z-10 bg-white/0 group-hover:bg-white/5 blur-xl transition-all duration-700 rounded-full scale-150" />
        </a>
      </div>

      {/* Standard Footer Area */}
      <div className="max-w-5xl mx-auto pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-white font-medium tracking-tight mb-1">Supratim Dhara</p>
          <p className="text-[#888888] font-light text-sm">Engineering the inevitable. Or at least trying to.</p>
          <div className="text-[#888888] font-mono text-[10px] mt-4 uppercase tracking-widest">
            © 2026 Supratim Dhara. All rights reserved, though I have no idea what that actually implies legally.
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap gap-6 text-[#A1A1A1]"
        >
          <a href="mailto:supratimdhara0@gmail.com" className="hover:text-white hover:scale-110 transition-all duration-300" aria-label="Email">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/supratimdhara/" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:scale-110 transition-all duration-300" aria-label="LinkedIn">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          <a href="https://x.com/supratimtwt" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:scale-110 transition-all duration-300" aria-label="Twitter">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="https://github.com/supratim1609" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:scale-110 transition-all duration-300" aria-label="GitHub">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.699-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </a>
        </motion.div>
      </div>
    </footer>
  );
}
