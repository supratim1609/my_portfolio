"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Copy, Check, GitBranch, BookOpen, Hash, ArrowRight } from 'lucide-react';

export default function ScatterDocsPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E5E5] font-sans selection:bg-[#FF3B30] selection:text-white">
      
      {/* 1. Framework Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-start space-y-8">
          
          <motion.a 
            href="https://github.com/supratim1609/scatterjs" target="_blank" rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex items-center space-x-2 border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors rounded-full px-4 py-1.5 text-xs font-mono text-emerald-400"
          >
            <GitBranch size={14} />
            <span>Scatter.js v1.0.0 is officially live on GitHub</span>
            <ArrowRight size={14} className="ml-2" />
          </motion.a>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-bold tracking-tight text-white leading-tight max-w-4xl"
          >
            Web-native federated learning infrastructure.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-[#A1A1A1] max-w-2xl font-light leading-relaxed"
          >
            Train AI models for $0 by crowdsourcing compute from your website visitors using WebGPU, 8-Bit Quantization, and Differential Privacy.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto"
          >
            <a href="#installation" className="bg-white text-black px-8 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors w-full sm:w-auto text-center flex items-center justify-center space-x-2">
              <BookOpen size={18} />
              <span>Get Started</span>
            </a>
            
            <div 
              className="flex items-center justify-between w-full sm:w-80 bg-[#111] border border-white/10 rounded-md p-3 cursor-pointer hover:border-white/30 transition-colors"
              onClick={() => handleCopy('npm install @supratim/scatter')}
            >
              <div className="flex items-center space-x-3 text-sm font-mono text-[#A1A1A1]">
                <span className="text-emerald-500">$</span>
                <span className="text-white">npm i @supratim/scatter</span>
              </div>
              <button className="text-[#555] hover:text-white transition-colors">
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Documentation Layout (Sidebar + Content) */}
      <div className="max-w-7xl mx-auto px-6 flex items-start gap-16 pt-12 pb-32">
        
        {/* Left Sidebar (Sticky) */}
        <aside className="hidden lg:block sticky top-24 w-64 shrink-0 space-y-8 overflow-y-auto max-h-[calc(100vh-6rem)] custom-scrollbar pb-10">
          
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Getting Started</h4>
            <div className="flex flex-col space-y-2 text-sm font-medium text-[#888]">
              <a href="#installation" className="hover:text-white transition-colors">Installation</a>
              <a href="#architecture" className="hover:text-white transition-colors">Architecture Overview</a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Client API (Browser)</h4>
            <div className="flex flex-col space-y-2 text-sm font-medium text-[#888]">
              <a href="#scatternode" className="hover:text-white transition-colors">ScatterNode</a>
              <a href="#web-workers" className="hover:text-white transition-colors">Web Worker Offloading</a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Server API (Node.js)</h4>
            <div className="flex flex-col space-y-2 text-sm font-medium text-[#888]">
              <a href="#coordinator" className="hover:text-white transition-colors">Coordinator</a>
              <a href="#websockets" className="hover:text-white transition-colors">WebSocket Ingestion</a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Cryptography & Math</h4>
            <div className="flex flex-col space-y-2 text-sm font-medium text-[#888]">
              <a href="#differential-privacy" className="hover:text-white transition-colors">Differential Privacy</a>
              <a href="#quantization" className="hover:text-white transition-colors">8-Bit Quantization</a>
              <a href="#fedavg" className="hover:text-white transition-colors">Federated Averaging</a>
            </div>
          </div>

        </aside>

        {/* Right Main Content */}
        <main className="flex-1 min-w-0 space-y-24">
          
          {/* Installation */}
          <section id="installation" className="space-y-6 scroll-mt-24">
            <h2 className="text-3xl font-bold text-white flex items-center group cursor-pointer">
              <Hash size={24} className="mr-2 text-[#333] group-hover:text-emerald-500 transition-colors" />
              Installation
            </h2>
            <p className="text-[#A1A1A1] leading-relaxed text-lg">
              ScatterJS is available as an NPM package. It contains both the browser-side <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-sm">ScatterNode</code> and the server-side <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-sm">Coordinator</code>.
            </p>
            
            <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden font-mono text-sm">
              <div className="px-4 py-2 border-b border-white/5 bg-[#1A1A1A] text-[#888] text-xs">Terminal</div>
              <div className="p-4 text-[#E5E5E5]">
                <span className="text-emerald-500 mr-2">$</span>npm install @supratim/scatter
              </div>
            </div>
          </section>

          {/* Architecture */}
          <section id="architecture" className="space-y-6 scroll-mt-24">
            <h2 className="text-3xl font-bold text-white flex items-center group cursor-pointer">
              <Hash size={24} className="mr-2 text-[#333] group-hover:text-emerald-500 transition-colors" />
              Architecture Overview
            </h2>
            <p className="text-[#A1A1A1] leading-relaxed text-lg">
              Standard AI training requires massive centralized GPU clusters. ScatterJS reverses this by shipping the neural network directly to your users&apos; browsers via WebAssembly/WebGPU. 
            </p>
            <p className="text-[#A1A1A1] leading-relaxed text-lg">
              When a user visits your website, a background Web Worker silently computes gradients on local data. It then encrypts these gradients with <strong>Laplacian Noise</strong>, compresses them into <strong>8-Bit Integers</strong>, and transmits them to your Node.js server via WebSockets.
            </p>
          </section>

          {/* Client Setup */}
          <section id="scatternode" className="space-y-6 scroll-mt-24 border-t border-white/10 pt-16">
            <h2 className="text-3xl font-bold text-white flex items-center group cursor-pointer">
              <Hash size={24} className="mr-2 text-[#333] group-hover:text-emerald-500 transition-colors" />
              Client Integration (React)
            </h2>
            <p className="text-[#A1A1A1] leading-relaxed text-lg">
              Initialize the <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-sm">ScatterNode</code> at the root of your application. It runs entirely off the main thread, ensuring your React UI maintains 60fps.
            </p>

            <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
              <div className="px-4 py-2 border-b border-white/5 bg-[#1A1A1A] text-[#888] text-xs font-mono">app/layout.tsx</div>
              <div className="p-6 text-sm font-mono overflow-x-auto text-[#E5E5E5] leading-relaxed">
                <p><span className="text-purple-400">import</span> {"{ useEffect }"} <span className="text-purple-400">from</span> <span className="text-green-400">&apos;react&apos;</span>;</p>
                <p><span className="text-purple-400">import</span> {"{ ScatterNode }"} <span className="text-purple-400">from</span> <span className="text-green-400">&apos;@supratim/scatter&apos;</span>;</p>
                <br />
                <p><span className="text-purple-400">export default function</span> <span className="text-blue-400">RootLayout</span>({"{ children }"}: {"{ children: React.ReactNode }"}) {"{"}</p>
                <p className="pl-4"><span className="text-blue-400">useEffect</span>(() {"=>"} {"{"}</p>
                <p className="pl-8 text-[#888]">{"// 1. Hook into your WebSocket server"}</p>
                <p className="pl-8">ScatterNode.<span className="text-yellow-200">connect</span>(<span className="text-green-400">&apos;wss://api.yourdomain.com/scatter&apos;</span>);</p>
                <br />
                <p className="pl-8 text-[#888]">{"// 2. Set Privacy parameters (Higher Epsilon = Less Noise)"}</p>
                <p className="pl-8">ScatterNode.<span className="text-teal-400">privacyEpsilon</span> = <span className="text-orange-400">1.5</span>;</p>
                <br />
                <p className="pl-8 text-[#888]">{"// 3. Spawns Web Worker and begins background compute"}</p>
                <p className="pl-8">ScatterNode.<span className="text-yellow-200">startTraining</span>();</p>
                <p className="pl-4">{"}, []);"}</p>
                <br />
                <p className="pl-4"><span className="text-purple-400">return</span> {"<html><body>{children}</body></html>"};</p>
                <p>{"}"}</p>
              </div>
            </div>
          </section>

          {/* Server Setup */}
          <section id="coordinator" className="space-y-6 scroll-mt-24 border-t border-white/10 pt-16">
            <h2 className="text-3xl font-bold text-white flex items-center group cursor-pointer">
              <Hash size={24} className="mr-2 text-[#333] group-hover:text-emerald-500 transition-colors" />
              Server Integration (Node.js)
            </h2>
            <p className="text-[#A1A1A1] leading-relaxed text-lg">
              The <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-sm">Coordinator</code> class manages the global weights. As quantized payloads stream in from clients via WebSocket, it queues them up and executes the Federated Averaging algorithm.
            </p>

            <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
              <div className="px-4 py-2 border-b border-white/5 bg-[#1A1A1A] text-[#888] text-xs font-mono">server.ts</div>
              <div className="p-6 text-sm font-mono overflow-x-auto text-[#E5E5E5] leading-relaxed">
                <p><span className="text-purple-400">import</span> {"{ Coordinator }"} <span className="text-purple-400">from</span> <span className="text-green-400">&apos;@supratim/scatter&apos;</span>;</p>
                <p><span className="text-purple-400">import</span> {"{ WebSocketServer }"} <span className="text-purple-400">from</span> <span className="text-green-400">&apos;ws&apos;</span>;</p>
                <br />
                <p className="text-[#888]">{"// Initialize network architecture (Inputs: 128, Hidden: 64, Outputs: 10)"}</p>
                <p><span className="text-purple-400">const</span> coordinator = <span className="text-purple-400">new</span> <span className="text-yellow-200">Coordinator</span>(<span className="text-orange-400">128</span>, <span className="text-orange-400">64</span>, <span className="text-orange-400">10</span>);</p>
                <p><span className="text-purple-400">const</span> wss = <span className="text-purple-400">new</span> <span className="text-yellow-200">WebSocketServer</span>({"{ port: "}<span className="text-orange-400">8080</span> {"}"});</p>
                <br />
                <p>wss.<span className="text-yellow-200">on</span>(<span className="text-green-400">&apos;connection&apos;</span>, (ws) {"=>"} {"{"}</p>
                <p className="pl-4">ws.<span className="text-yellow-200">on</span>(<span className="text-green-400">&apos;message&apos;</span>, (payload) {"=>"} {"{"}</p>
                <p className="pl-8 text-[#888]">{"// The Coordinator automatically decodes the Int8 payloads and buffers them."}</p>
                <p className="pl-8">coordinator.<span className="text-yellow-200">receiveUpdate</span>(payload);</p>
                <p className="pl-4">{"});"}</p>
                <p>{"});"}</p>
                <br />
                <p className="text-[#888]">{"// Run FedAvg every 10 minutes to upgrade the global model"}</p>
                <p><span className="text-blue-400">setInterval</span>(() {"=>"} {"{"}</p>
                <p className="pl-4">coordinator.<span className="text-yellow-200">aggregate</span>();</p>
                <p className="pl-4"><span className="text-blue-400">console</span>.<span className="text-yellow-200">log</span>(<span className="text-green-400">&apos;Global Model Upgraded via FedAvg.&apos;</span>);</p>
                <p>{"}, "}<span className="text-orange-400">600000</span>{");"}</p>
              </div>
            </div>
          </section>

          {/* Cryptography */}
          <section id="differential-privacy" className="space-y-6 scroll-mt-24 border-t border-white/10 pt-16">
            <h2 className="text-3xl font-bold text-white flex items-center group cursor-pointer">
              <Hash size={24} className="mr-2 text-[#333] group-hover:text-emerald-500 transition-colors" />
              Differential Privacy (Math)
            </h2>
            <p className="text-[#A1A1A1] leading-relaxed text-lg">
              ScatterJS uses Cryptographic Laplacian Noise to ensure absolute privacy. By injecting a mathematically calibrated random value into every single gradient calculated by the browser, reverse-engineering the raw user data becomes impossible.
            </p>
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-lg text-emerald-400 text-sm">
              <strong className="block mb-2 text-white">How the noise cancels out:</strong>
              Because the Laplacian noise is centered perfectly at 0, when the Server <code className="text-white bg-black/30 px-1 rounded">Coordinator</code> averages the gradients of thousands of users simultaneously, the injected noise from User A perfectly cancels out the injected noise from User B. The noise disappears, leaving only the pure mathematical gradient.
            </div>
          </section>

        </main>
      </div>

    </div>
  );
}
