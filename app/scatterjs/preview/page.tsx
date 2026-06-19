"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ServerOff, Zap, Shield, Network } from 'lucide-react';
import Link from 'next/link';

export default function ScatterComparisonPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms for the hero section
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-[200vh] bg-[#050505] text-[#E5E5E5] font-sans selection:bg-[#FF3B30] selection:text-white overflow-hidden">
      
      <div className="max-w-6xl mx-auto px-6 sm:px-12 pt-32 pb-24 space-y-32">
        
        {/* 1. Hero Section (Parallax) */}
        <motion.section 
          style={{ y: heroY, opacity: heroOpacity }}
          className="flex flex-col items-center text-center space-y-8 relative z-0 h-[60vh] justify-center"
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="flex items-center space-x-3 border border-white/10 rounded-full px-4 py-1.5"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-mono text-[#A1A1A1] tracking-widest uppercase">Scatter.js v1.0</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-7xl sm:text-9xl font-black tracking-tighter text-white leading-none"
          >
            ScatterJS.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-[#A1A1A1] max-w-2xl font-light leading-relaxed"
          >
            Decentralized Edge AI. Train models by crowdsourcing compute from your website visitors.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center space-x-4 pt-4"
          >
            <Link href="/scatterjs/docs" className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">
              Read the Docs
            </Link>
            <a href="https://github.com/supratim1609/scatterjs" target="_blank" rel="noopener noreferrer" className="border border-[#A1A1A1] text-white px-6 py-3 rounded-full font-semibold hover:border-white transition-colors">
              View on GitHub
            </a>
          </motion.div>
        </motion.section>

        {/* 2. The Paradigm Shift */}
        <section className="space-y-16 relative z-10 bg-[#050505] pt-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">The Paradigm Shift</h2>
            <p className="text-[#A1A1A1] max-w-2xl mx-auto">Why pay AWS for GPU clusters when you can utilize the dormant compute power of millions of browsers?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* The Old Way */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 space-y-6"
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                <ServerOff size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Centralized Cloud</h3>
                <p className="text-sm text-[#A1A1A1] font-mono">$10,000/mo GPU Bills</p>
              </div>
              <ul className="space-y-3 text-[#A1A1A1]">
                <li className="flex items-center space-x-2">
                  <span className="text-red-500">✕</span>
                  <span>Massive server costs</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-red-500">✕</span>
                  <span>Severe privacy risks</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-red-500">✕</span>
                  <span>Single point of failure</span>
                </li>
              </ul>
            </motion.div>

            {/* The Scatter Way */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-8 space-y-6 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Network size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">ScatterJS</h3>
                <p className="text-sm text-[#A1A1A1] font-mono">$0/mo Free Compute</p>
              </div>
              <ul className="space-y-3 text-[#A1A1A1]">
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Distributed WebAssembly</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Zero raw data leaves device</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Infinite horizontal scaling</span>
                </li>
              </ul>
            </motion.div>

          </div>
        </section>

        {/* 3. Under the Hood */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Under the Hood</h2>
            <p className="text-[#A1A1A1]">Powered by cutting-edge cryptographic and mathematical engines.</p>
          </div>

          <Link href="/scatterjs/math">
            <div className="bg-[#0A0A0A] border border-white/10 hover:border-white/30 transition-colors rounded-2xl p-8 sm:p-12 text-center group cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 space-y-6 flex flex-col items-center">
                <div className="flex space-x-4">
                  <Zap className="text-yellow-500" size={32} />
                  <Shield className="text-blue-500" size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">The Mathematics of Scatter.js</h3>
                  <p className="text-[#A1A1A1] max-w-2xl mx-auto">
                    Dive into the raw calculus behind 8-Bit Compression, Laplacian Noise Generation, and Federated Averaging.
                  </p>
                </div>
                <div className="text-emerald-500 font-bold group-hover:text-emerald-400 transition-colors">
                  Read the Whitepaper &rarr;
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* 4. Security Guarantee */}
        <section className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-red-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl font-bold text-white">&quot;Wait, can you access my laptop&apos;s data?&quot;</h2>
            <p className="text-lg text-red-400 font-bold uppercase tracking-widest">Absolutely Not.</p>
            <p className="text-[#A1A1A1] max-w-3xl mx-auto leading-relaxed">
              ScatterJS runs inside a strict, sandboxed browser Web Worker. It cannot read your files, it cannot access your personal data, and it cannot see what else you are doing. 
              <br/><br/>
              Furthermore, the data it <em>does</em> process for the AI model is encrypted with <strong>Laplacian Noise</strong> before it is ever transmitted. Even if the server is compromised, your raw data is mathematically impossible to reverse-engineer.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
