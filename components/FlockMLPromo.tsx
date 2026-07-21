"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Cpu, Shield, Zap } from "lucide-react";

export default function FlockMLPromo() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 py-32 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full max-h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Grid Pattern (Subtle) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none" />

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center space-y-6"
      >
        <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-orange-500 text-sm font-medium tracking-widest uppercase">FlockML V2.4 is Live</span>
        </div>
        
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white max-w-4xl">
          The Sovereign AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Grid.</span>
        </h2>
        
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
          Zero cloud servers. Zero latency. 100% Data Sovereignty. 
          FlockML executes quantized LLMs entirely in your browser using a high-performance WebAssembly & WebGPU engine.
        </p>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="pt-6"
        >
          <Link href="/flock-ml" className="group relative inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-lg overflow-hidden transition-all hover:bg-gray-100 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)]">
            <span>Launch Playground</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Feature Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-24">
        {[
          {
            title: "WebGPU Native",
            description: "Bypasses the CPU. Compiles WGSL compute shaders on the fly to utilize raw local VRAM.",
            icon: <Cpu className="w-6 h-6 text-orange-500" />,
            delay: 0.2
          },
          {
            title: "Local DP",
            description: "Cryptographically secure Laplacian noise applied to all user data before leaving the device.",
            icon: <Shield className="w-6 h-6 text-orange-500" />,
            delay: 0.4
          },
          {
            title: "Zero-Copy Wasm",
            description: "Direct memory mapping for 8-bit quantized weights. No JS heap garbage collection pauses.",
            icon: <Zap className="w-6 h-6 text-orange-500" />,
            delay: 0.6
          }
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: feature.delay }}
            whileHover={{ y: -5, borderColor: "rgba(249, 115, 22, 0.3)" }}
            className="flex flex-col space-y-4 p-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-white">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
