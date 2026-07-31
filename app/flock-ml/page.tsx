"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Cpu, Shield, Zap, Globe, Sparkles, Check, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// ─── SIMPLE TERMS DEMO COMPONENT ──────────────────────────────────────────────

function InteractiveSimulator() {
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [privacyEpsilon, setPrivacyEpsilon] = useState(0.5);

  const STEPS = [
    { title: "1. Join the Swarm", desc: "User opens a browser tab. The tab instantly registers as a compute node via WebSockets." },
    { title: "2. Load Quantized Shards", desc: "A compressed 1.58-bit model shard (32MB) is streamed directly into the browser's OPFS cache." },
    { title: "3. Run WebGPU Shaders", desc: "The model runs directly on the device GPU using WGSL compute shaders. Zero latency. $0 server bill." },
    { title: "4. Private Aggregation", desc: "Gradients are computed locally, masked with Differential Privacy noise, and merged into the global model." }
  ];

  const startSimulation = async () => {
    if (running) return;
    setRunning(true);
    setStep(0);
    setLogs(["[system] Swarm handshaking...", "[webrtc] WebRTC DataChannel established"]);

    const runSteps = [
      { msg: "[system] Swarm connected. Node assigned ID: IN-DEL-041", delay: 1000 },
      { msg: "[opfs] Model cached. Initialized PARAM-Siddh-3B (1.58-bit)", delay: 1200 },
      { msg: "[webgpu] Compiling WGSL compute pipelines...", delay: 800 },
      { msg: "[webgpu] Shaders compiled in 4ms. Core operations active.", delay: 800 },
      { msg: `[privacy] Laplacian noise applied (epsilon = ${privacyEpsilon})`, delay: 1000 },
      { msg: "[system] Gradient vector aggregated. Swarm converged.", delay: 800 }
    ];

    for (let i = 0; i < runSteps.length; i++) {
      await new Promise(r => setTimeout(r, runSteps[i].delay));
      setLogs(prev => [...prev, runSteps[i].msg]);
      if (i === 1) setStep(1);
      if (i === 3) setStep(2);
      if (i === 5) setStep(3);
    }
    setRunning(false);
  };

  return (
    <div className="border border-white/10 bg-[#0c0d12] rounded-xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
      {/* Simulation flow controls */}
      <div className="p-6 sm:p-8 flex flex-col justify-between border-r border-white/5">
        <div className="space-y-4">
          <div className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">Live Interactive Demo</div>
          <h3 className="text-xl sm:text-2xl font-black text-white">How it works</h3>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            Click the button below to watch a browser node fetch a quantized model shard, initialize WebGPU acceleration, and perform local training.
          </p>

          <div className="space-y-3 pt-2">
            {STEPS.map((s, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 p-2.5 rounded transition-all ${
                  step === idx ? "bg-white/[0.04] border border-white/10" : "opacity-40 border border-transparent"
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center font-mono text-[10px] text-zinc-300 font-bold shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-none mb-1">{s.title}</div>
                  <div className="text-[10px] text-zinc-500 leading-snug">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={startSimulation}
            disabled={running}
            className="flex-1 py-3 px-4 rounded bg-white text-black font-mono text-xs uppercase font-bold tracking-wider hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {running ? "Simulating Swarm..." : "Run Browser Swarm Node"}
          </button>
        </div>
      </div>

      {/* Code / logs simulator */}
      <div className="bg-[#050608] p-6 sm:p-8 flex flex-col justify-between font-mono text-xs text-zinc-400">
        <div className="space-y-3">
          <div className="flex justify-between pb-2 border-b border-white/[0.05]">
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Local Node Logs</span>
            <span className="text-[9px] text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE
            </span>
          </div>

          <div className="space-y-1.5 min-h-[160px] max-h-[220px] overflow-y-auto pr-1">
            {logs.length === 0 && (
              <span className="text-zinc-700 italic">Click simulation trigger to watch runtime pipeline log...</span>
            )}
            {logs.map((log, idx) => (
              <div key={idx} className="truncate">
                <span className="text-zinc-600">&gt;</span> {log}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.05] mt-4 space-y-2">
          <div className="flex justify-between text-[10px] text-zinc-500">
            <span>HARDWARE COMPATIBILITY:</span>
            <span className="text-zinc-300">WebGPU (Chrome/Mac)</span>
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500">
            <span>SHARD STORAGE:</span>
            <span className="text-zinc-300">Origin Private FS</span>
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500">
            <span>PRIVACY COEFFICIENT:</span>
            <span className="text-purple-400 font-bold">ε = {privacyEpsilon}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function FlockExplainerPage() {
  return (
    <div className="min-h-screen bg-[#06080c] text-[#e2e8f0] font-sans overflow-x-hidden selection:bg-white selection:text-black">
      
      {/* Back glow overlay */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-950/10 rounded-full blur-[140px] pointer-events-none" />

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-blue-400" />
          <span className="font-mono text-xs tracking-[0.25em] uppercase font-bold text-white">FlockML</span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/flock-ml/command"
            className="font-mono text-[10px] tracking-wider uppercase text-zinc-400 hover:text-white transition-colors"
          >
            Swarm Command Deck
          </Link>
          <Link 
            href="/flock-ml/docs" 
            className="font-mono text-[10px] tracking-wider uppercase text-zinc-400 hover:text-white transition-colors"
          >
            Documentation
          </Link>
        </div>
      </header>

      {/* ── HERO EXPLAINER ─────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center space-y-6">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-blue-400 font-bold">
          Sovereign AI Infrastructure
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.05]">
          A decentralized compute network<br />
          <span className="text-zinc-500">running inside ordinary browser tabs.</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          FlockML is an open-source protocol that allows anyone to run and train Large Language Models natively in the browser. Zero Python, zero CUDA, zero server bills.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link 
            href="/flock-ml/command" 
            className="flex items-center gap-2 bg-white text-black px-6 py-3 font-mono text-xs uppercase font-bold tracking-widest hover:bg-zinc-200 transition-all rounded shadow-lg shadow-white/5"
          >
            Launch Command Center
            <ArrowUpRight size={14} />
          </Link>
          <Link 
            href="/flock-ml/docs" 
            className="flex items-center gap-2 border border-white/20 hover:border-white px-6 py-3 font-mono text-xs uppercase font-bold tracking-widest transition-all rounded text-zinc-300"
          >
            Read Docs
          </Link>
        </div>
      </section>

      {/* ── 3 CORE COLUMNS (WHAT, WHY, HOW) ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/[0.05]">
        
        {/* WHAT CARD */}
        <div className="space-y-4 bg-white/[0.01] border border-white/[0.04] p-6 rounded-xl">
          <div className="w-10 h-10 rounded bg-blue-950/30 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Globe size={18} />
          </div>
          <h2 className="font-mono text-xs tracking-wider uppercase text-white font-bold">1. WHAT are we building?</h2>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            We are building a <strong>sovereign distributed AI grid</strong>. Instead of sending private data to centralized corporate servers or buying expensive hardware clusters, FlockML orchestrates AI workloads natively in the user's browser across thousands of edge devices.
          </p>
        </div>

        {/* WHY CARD */}
        <div className="space-y-4 bg-white/[0.01] border border-white/[0.04] p-6 rounded-xl">
          <div className="w-10 h-10 rounded bg-purple-950/30 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Shield size={18} />
          </div>
          <h2 className="font-mono text-xs tracking-wider uppercase text-white font-bold">2. WHY are we building it?</h2>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            Centralized AI clouds introduce severe **privacy risks** and **extravagant compute costs**. We build FlockML to reclaim compute sovereignty, run inference for free, and guarantee data privacy by executing training algorithms locally on edge machines.
          </p>
        </div>

        {/* HOW CARD */}
        <div className="space-y-4 bg-white/[0.01] border border-white/[0.04] p-6 rounded-xl">
          <div className="w-10 h-10 rounded bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Zap size={18} />
          </div>
          <h2 className="font-mono text-xs tracking-wider uppercase text-white font-bold">3. HOW does it work?</h2>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            Models are quantized down to **1.58-bit ternary formats** and run inside browser tabs using **WebGPU compute shaders** and **Rust WebAssembly**. Multiple local devices connect via **WebRTC** to pool capacity, converging parameters via Federated Learning.
          </p>
        </div>

      </section>

      {/* ── DETAILED CONCEPT SECTIONS ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-white/[0.05] space-y-16">
        
        {/* Explainer 1: The Sovereign Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <div className="font-mono text-[9px] tracking-widest text-blue-400 uppercase font-bold">01 / National Autonomy</div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              Sovereign Compute for National Security & Administration
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              For public administrations, research institutions, and defense wings (like DRDO or MEITY), renting GPU compute from foreign cloud giants poses a critical strategic vulnerability. 
            </p>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              FlockML allows the government to spin up a completely independent, localized AI infrastructure mesh utilizing existing desktop assets, office terminals, and edge hubs in private local loops.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 bg-white/[0.01] border border-white/[0.04] p-6 rounded-xl">
            <div className="space-y-1.5 p-3.5 bg-black/40 rounded border border-white/[0.03]">
              <Cpu size={14} className="text-blue-400" />
              <div className="font-mono text-[10px] font-bold text-white">ZERO SERVER BILLS</div>
              <p className="text-[9px] text-zinc-500 leading-snug">Rides on device browsers. Total infrastructure costs scale down to exactly $0.</p>
            </div>
            <div className="space-y-1.5 p-3.5 bg-black/40 rounded border border-white/[0.03]">
              <Shield size={14} className="text-emerald-400" />
              <div className="font-mono text-[10px] font-bold text-white">DATA SOVEREIGNTY</div>
              <p className="text-[9px] text-zinc-500 leading-snug">Data never leaves the browser. Laplacian noise masks the gradient updates.</p>
            </div>
            <div className="space-y-1.5 p-3.5 bg-black/40 rounded border border-white/[0.03]">
              <Zap size={14} className="text-purple-400" />
              <div className="font-mono text-[10px] font-bold text-white">WEBGPU QUANTIZATION</div>
              <p className="text-[9px] text-zinc-500 leading-snug">Model weights compressed to BitNet 1.58-bit specs to run on standard hardware.</p>
            </div>
            <div className="space-y-1.5 p-3.5 bg-black/40 rounded border border-white/[0.03]">
              <Globe size={14} className="text-amber-400" />
              <div className="font-mono text-[10px] font-bold text-white">P2P DATACHANNELS</div>
              <p className="text-[9px] text-zinc-500 leading-snug">Peer devices connect using WebRTC data links, forming an autonomic fallback grid.</p>
            </div>
          </div>
        </div>

        {/* Live Simulator Segment */}
        <div className="pt-8">
          <InteractiveSimulator />
        </div>

      </section>

      {/* ── FOOTER CTA ────────────────────────────────────────────────────── */}
      <footer className="px-6 py-16 border-t border-white/[0.05] max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-[10px] text-zinc-500">
        <div>
          <span>FlockML Sovereign Compute Mesh Project · MIT License</span>
        </div>
        <div className="flex gap-4">
          <a href="https://github.com/supratim1609/flockML" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          <Link href="/flock-ml/command" className="hover:text-white transition-colors">Admin Console</Link>
          <Link href="/flock-ml/docs" className="hover:text-white transition-colors">Docs</Link>
        </div>
      </footer>

    </div>
  );
}

