"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="py-20 px-6 lg:px-8 bg-[#050505] border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
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
          className="flex flex-wrap gap-6 text-sm font-medium text-[#A1A1A1]"
        >
          <a href="mailto:supratimdhara0@gmail.com" className="hover:text-white transition-colors duration-300">Email</a>
          <a href="https://medium.com/@supratimdhara0" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">Medium</a>
          <a href="https://www.linkedin.com/in/supratimdhara/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">LinkedIn</a>
          <a href="https://x.com/supratimtwt" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">Twitter</a>
          <a href="https://github.com/supratim1609" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">GitHub</a>
        </motion.div>
      </div>
    </footer>
  );
}
