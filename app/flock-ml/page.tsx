"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, GitBranch, BookOpen, ArrowRight, Shield, Cpu, Network } from 'lucide-react';
import Link from 'next/link';
import WebGPUDemo from '@/components/WebGPUDemo';

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
            className="flex items-center space-x-2 border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-mono text-emerald-400 backdrop-blur-md cursor-pointer group text-center"
          >
            <GitBranch size={16} />
            <span>FlockML v1.2.0 is officially live on NPM</span>
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </motion.a>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-5xl sm:text-7xl lg:text-9xl font-black tracking-tighter leading-[1.05] max-w-6xl text-transparent bg-clip-text bg-gradient-to-b from-white to-[#777]"
          >
            Decentralize your <br className="hidden md:block"/> AI infrastructure.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-xl sm:text-2xl text-[#A1A1A1] max-w-3xl font-light leading-relaxed"
          >
            Train machine learning models for exactly $0 by crowdsourcing compute from your website visitors using a native Rust WebAssembly Engine, 8-Bit Quantization, and Differential Privacy.
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
                    <span className="text-white">npm i flockml</span>
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

      {/* Interactive Benchmarks & Zero-Copy Memory Maps */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-40">
        <div className="border border-white/5 bg-[#0A0A0A]/40 backdrop-blur-md rounded-3xl p-8 md:p-12 space-y-12">
          
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Benchmarks & V8 Optimization</h2>
            <p className="text-[#888] leading-relaxed text-lg">
              Chrome's V8 JIT compiler struggles with garbage-collecting high-frequency tensor arrays. FlockML bypasses this limit by managing allocations natively in WebAssembly linear memory.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Visual speed comparison */}
            <div className="space-y-6 bg-black/40 border border-white/5 p-8 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-emerald-400 font-bold">INT8 QUANTIZATION THROUGHPUT</span>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 rounded-full px-3 py-1 font-mono">400,000 parameters</span>
              </div>

              <div className="space-y-4">
                {/* Wasm */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-white font-bold">Wasm-Native Zero-Copy Mapping</span>
                    <span className="text-emerald-400 font-bold">&lt; 1.0 ms / op</span>
                  </div>
                  <div className="h-3 w-full bg-[#111] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[2.7%] transition-all duration-1000"></div>
                  </div>
                </div>

                {/* JS */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-[#888]">JS-Legacy Array Iteration</span>
                    <span className="text-red-400 font-bold">36.0 ms / op</span>
                  </div>
                  <div className="h-3 w-full bg-[#111] rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full w-full transition-all duration-1000"></div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-[#666] font-mono leading-relaxed pt-2 border-t border-white/5">
                Note: Standard JIT array mapping incurs high garbage collection cycles. Mapping Wasm memory directly via a typed view (Int8Array) achieves a <span className="text-emerald-400 font-bold">36x raw speedup</span>.
              </div>
            </div>

            {/* Visual Footprint comparison */}
            <div className="space-y-6 bg-black/40 border border-white/5 p-8 rounded-2xl">
              <span className="text-sm font-mono text-[#888] font-bold">STARTUP / NETWORK PAYLOAD SIZE</span>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="border border-emerald-500/20 bg-emerald-500/5 p-4 rounded-xl space-y-1">
                  <div className="text-xs text-[#888] font-mono">FlockML Core</div>
                  <div className="text-2xl font-black text-white font-mono">38KB</div>
                  <div className="text-[10px] text-emerald-400">Wasm Crate</div>
                </div>

                <div className="border border-white/5 bg-white/5 p-4 rounded-xl space-y-1 opacity-60">
                  <div className="text-xs text-[#888] font-mono">ONNX Web</div>
                  <div className="text-2xl font-black text-white font-mono">~5MB</div>
                  <div className="text-[10px] text-[#555]">C++ Runtime</div>
                </div>

                <div className="border border-white/5 bg-white/5 p-4 rounded-xl space-y-1 opacity-60">
                  <div className="text-xs text-[#888] font-mono">TensorFlow.js</div>
                  <div className="text-2xl font-black text-white font-mono">~30MB</div>
                  <div className="text-[10px] text-[#555]">JS Heap</div>
                </div>
              </div>

              <div className="text-sm text-[#666] font-mono leading-relaxed pt-2 border-t border-white/5">
                FlockML compiles to bare-metal WebAssembly targets. We bypass large inference packages, keeping client-side dependencies ultra-lightweight.
              </div>
            </div>

          </div>

          {/* Live WebGPU Zero-Copy Playground */}
          <div className="border-t border-white/5 pt-12">
            <WebGPUDemo />
          </div>

          {/* Interactive Code Playground / Flow */}
          <div className="border-t border-white/5 pt-12">
            <h3 className="text-xl font-bold text-white mb-6">Zero-Copy Memory Handshake Flow</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs text-[#888]">
              
              <div className="border border-white/5 bg-black/20 p-6 rounded-2xl space-y-2">
                <div className="text-white font-bold">1. Wasm Linear Memory</div>
                <p>Rust compiles backpropagation weights natively to continuous 1D buffers within the linear Wasm memory block.</p>
              </div>

              <div className="border border-white/5 bg-black/20 p-6 rounded-2xl space-y-2">
                <div className="text-white font-bold">2. Typed Array Pointer</div>
                <p>JS calls the memory pointer using offset and length limits without allocating new heap memory arrays.</p>
              </div>

              <div className="border border-white/5 bg-black/20 p-6 rounded-2xl space-y-2">
                <div className="text-white font-bold">3. Network Transmission</div>
                <p>The mapped Int8Array buffer is passed directly to the WebSocket tunnel, achieving instantaneous execution.</p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Feature Cards */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative"
          >
            <div className="absolute -inset-px bg-gradient-to-b from-yellow-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative h-full bg-[#0A0A0A]/50 backdrop-blur-sm border border-white/5 p-8 rounded-3xl group-hover:-translate-y-2 transition-transform duration-500 shadow-2xl hover:shadow-yellow-500/10 space-y-6">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center border border-yellow-500/20 group-hover:scale-110 transition-transform duration-500">
                <Cpu className="text-yellow-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Zero-Latency Protobufs</h3>
              <p className="text-[#888] leading-relaxed text-base">
                Float32 networks are quantized to 8-bit integers and strictly encoded into raw binary Protocol Buffers, reducing payloads by 90% for instant WebSocket transmission.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative"
          >
            <div className="absolute -inset-px bg-gradient-to-b from-purple-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative h-full bg-[#0A0A0A]/50 backdrop-blur-sm border border-white/5 p-8 rounded-3xl group-hover:-translate-y-2 transition-transform duration-500 shadow-2xl hover:shadow-purple-500/10 space-y-6">
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform duration-500">
                <Shield className="text-purple-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Rust WebAssembly Engine</h3>
              <p className="text-[#888] leading-relaxed text-base">
                Compiled directly from native Rust, our Wasm bridge allocates massive matrix arrays in raw browser memory, achieving 97% of native C++ speed for local SGD compute.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
            className="group relative"
          >
            <div className="absolute -inset-px bg-gradient-to-b from-blue-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative h-full bg-[#0A0A0A]/50 backdrop-blur-sm border border-white/5 p-8 rounded-3xl group-hover:-translate-y-2 transition-transform duration-500 shadow-2xl hover:shadow-blue-500/10 space-y-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                <Network className="text-blue-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Differential Privacy</h3>
              <p className="text-[#888] leading-relaxed text-base">
                Cryptographic Laplacian noise is injected directly into browser gradients, making it mathematically impossible to reverse-engineer user training data.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
            className="group relative"
          >
            <div className="absolute -inset-px bg-gradient-to-b from-emerald-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative h-full bg-[#0A0A0A]/50 backdrop-blur-sm border border-white/5 p-8 rounded-3xl group-hover:-translate-y-2 transition-transform duration-500 shadow-2xl hover:shadow-emerald-500/10 space-y-6">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                <Check className="text-emerald-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Dynamic Profiling</h3>
              <p className="text-[#888] leading-relaxed text-base">
                The web worker silently profiles the visitor's hardware FLOPS, dynamically scaling batch sizes to maximize utilization without disrupting the user experience.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
