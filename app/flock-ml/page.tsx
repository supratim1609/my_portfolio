"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, GitBranch, BookOpen, ArrowRight, Shield, Cpu, Network } from 'lucide-react';
import Link from 'next/link';

export default function FlockHomePage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E5E5] font-sans selection:bg-emerald-500/30 selection:text-white overflow-hidden relative pt-10">
      
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] pointer-events-none"></div>

      {/* Hero Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      
      {/* Framework Hero */}
      <section className="relative z-10 pt-32 lg:pt-40 pb-24 flex flex-col items-center justify-center min-h-[75vh]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center space-y-12 w-full">
          
          <motion.a 
            href="https://github.com/supratim1609/flock-ml" target="_blank" rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center space-x-2 border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors rounded-full px-5 py-2 text-sm font-mono text-emerald-400 backdrop-blur-md cursor-pointer group"
          >
            <GitBranch size={16} />
            <span>FlockML v1.0.0 is officially live on GitHub</span>
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </motion.a>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-6xl sm:text-7xl lg:text-9xl font-black tracking-tighter leading-[1.05] max-w-6xl text-transparent bg-clip-text bg-gradient-to-b from-white to-[#777]"
          >
            Decentralize your <br className="hidden md:block"/> AI infrastructure.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-xl sm:text-2xl text-[#A1A1A1] max-w-3xl font-light leading-relaxed"
          >
            Train machine learning models for exactly $0 by crowdsourcing compute from your website visitors using WebGPU, 8-Bit Quantization, and Differential Privacy.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-6 pt-8 w-full sm:w-auto"
          >
            <Link href="/flock-ml/docs" className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:scale-105 hover:bg-gray-100 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] w-full sm:w-auto text-center flex items-center justify-center space-x-2 text-lg">
              <BookOpen size={20} />
              <span>Read the Docs</span>
            </Link>
            
            {/* Glassmorphic Terminal */}
            <div className="relative group w-full sm:w-96 cursor-pointer" onClick={() => handleCopy('npm install flock-ml')}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex flex-col w-full bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                {/* Mac Window Controls */}
                <div className="bg-[#111]/80 px-4 py-2 border-b border-white/5 flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  <span className="text-xs text-[#555] font-mono ml-4 flex-1 text-left">bash</span>
                </div>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3 text-base font-mono text-[#A1A1A1]">
                    <span className="text-emerald-500 font-bold">$</span>
                    <span className="text-white">npm i flock-ml</span>
                  </div>
                  <button className="text-[#555] group-hover:text-white transition-colors">
                    {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative"
          >
            <div className="absolute -inset-px bg-gradient-to-b from-yellow-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative h-full bg-[#0A0A0A]/50 backdrop-blur-sm border border-white/5 p-10 rounded-3xl group-hover:-translate-y-2 transition-transform duration-500 shadow-2xl hover:shadow-yellow-500/10 space-y-6">
              <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center border border-yellow-500/20 group-hover:scale-110 transition-transform duration-500">
                <Cpu className="text-yellow-500" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">8-Bit Quantization</h3>
              <p className="text-[#888] leading-relaxed text-lg">
                Min-Max quantization compresses Float32 network weights down to Int8 matrices, radically reducing WebSocket payload size and browser memory constraints.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative"
          >
            <div className="absolute -inset-px bg-gradient-to-b from-blue-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative h-full bg-[#0A0A0A]/50 backdrop-blur-sm border border-white/5 p-10 rounded-3xl group-hover:-translate-y-2 transition-transform duration-500 shadow-2xl hover:shadow-blue-500/10 space-y-6">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                <Shield className="text-blue-500" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Differential Privacy</h3>
              <p className="text-[#888] leading-relaxed text-lg">
                Cryptographic Laplacian noise is injected directly into browser gradients, making it mathematically impossible to reverse-engineer user training data.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
            className="group relative"
          >
            <div className="absolute -inset-px bg-gradient-to-b from-emerald-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative h-full bg-[#0A0A0A]/50 backdrop-blur-sm border border-white/5 p-10 rounded-3xl group-hover:-translate-y-2 transition-transform duration-500 shadow-2xl hover:shadow-emerald-500/10 space-y-6">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                <Network className="text-emerald-500" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Federated Averaging</h3>
              <p className="text-[#888] leading-relaxed text-lg">
                The lightweight Node.js Coordinator scales horizontally to aggregate and execute FedAvg on thousands of concurrent WebWorker payloads simultaneously.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
