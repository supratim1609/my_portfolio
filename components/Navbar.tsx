"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "Work", href: "/#work" },
    { name: "Experience", href: "/#experience" },
    { name: "Presence", href: "/#presence" },
    { name: "Articles", href: "/blog" },
  ];

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-[#050505]/70 backdrop-blur-lg"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
          <Link href="/" className="relative w-14 h-14 flex items-center justify-center group">
            <Image 
              src="/chill-guy.png" 
              alt="The Chill Guy" 
              fill 
              className="object-contain group-hover:scale-110 transition-transform duration-500" 
            />
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-xs font-mono uppercase tracking-widest text-[#A1A1A1] hover:text-white transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-[#FF3B30] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-xs font-mono uppercase tracking-widest text-[#A1A1A1] hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? "CLOSE" : "MENU"}
          </button>
        </div>
      </motion.header>

      {/* Minimal Mobile Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 right-0 z-[90] bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 md:hidden"
          >
            <div className="flex flex-col px-6 py-8 gap-6">
              {links.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-bold text-[#A1A1A1] hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
