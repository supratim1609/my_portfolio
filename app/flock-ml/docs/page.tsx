"use client";

import React, { useState } from 'react';
import { Copy, Check, Hash, Code2, Baby } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FlockDocsPage() {
  const [copied, setCopied] = useState(false);
  const [isEli5, setIsEli5] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E5E5] font-sans selection:bg-[#FF3B30] selection:text-white pt-24 pb-32">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-start gap-16 min-w-0">
        
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
              <a href="#flocknode" className="hover:text-white transition-colors">Client Setup</a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Server API (Node.js)</h4>
            <div className="flex flex-col space-y-2 text-sm font-medium text-[#888]">
              <a href="#coordinator" className="hover:text-white transition-colors">Server Setup</a>
              <a href="#advanced-config" className="hover:text-white transition-colors">Configuration</a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Concepts</h4>
            <div className="flex flex-col space-y-2 text-sm font-medium text-[#888]">
              <a href="#speed-paradox" className="hover:text-white transition-colors">The 8-Bit Speed Paradox</a>
              <a href="#privacy" className="hover:text-white transition-colors">Differential Privacy</a>
              <a href="#comparison" className="hover:text-white transition-colors">FlockML vs Cloud AI</a>
            </div>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="flex-1 min-w-0 space-y-24">
          
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-white mb-4 break-words">FlockML Documentation</h1>
              <p className="text-lg sm:text-xl text-[#A1A1A1] font-light leading-relaxed max-w-2xl">
                {isEli5 
                  ? "Learn how to build a giant LEGO castle for free by inviting your friends to a party."
                  : "An exhaustive developer guide for integrating decentralized, privacy-preserving federated learning into your applications."}
              </p>
            </div>

            {/* Global Toggle */}
            <div className="flex flex-col sm:flex-row sm:inline-flex w-full sm:w-auto bg-[#111] border border-white/10 rounded-2xl sm:rounded-full p-1 relative z-10">
              <button 
                onClick={() => setIsEli5(false)}
                className={`relative px-4 sm:px-6 py-3 sm:py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold flex justify-center items-center space-x-2 transition-colors ${!isEli5 ? 'text-white' : 'text-[#888] hover:text-white'}`}
              >
                {!isEli5 && <motion.div layoutId="docToggle" className="absolute inset-0 bg-white/10 rounded-xl sm:rounded-full border border-white/5" />}
                <Code2 size={16} className="relative z-10 shrink-0" />
                <span className="relative z-10 whitespace-nowrap">Engineer Mode</span>
              </button>
              <button 
                onClick={() => setIsEli5(true)}
                className={`relative px-4 sm:px-6 py-3 sm:py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold flex justify-center items-center space-x-2 transition-colors ${isEli5 ? 'text-emerald-400' : 'text-[#888] hover:text-white'}`}
              >
                {isEli5 && <motion.div layoutId="docToggle" className="absolute inset-0 bg-emerald-500/10 rounded-xl sm:rounded-full border border-emerald-500/20" />}
                <Baby size={16} className="relative z-10 shrink-0" />
                <span className="relative z-10 whitespace-nowrap">5-Year-Old Mode</span>
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={isEli5 ? 'eli5' : 'engineer'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-24 w-full min-w-0"
            >
              
              {/* Installation */}
              <section id="installation" className="space-y-6 scroll-mt-24">
                <h2 className="text-3xl font-bold text-white flex items-center group cursor-pointer">
                  <Hash size={24} className="mr-2 text-[#333] group-hover:text-emerald-500 transition-colors" />
                  Installation
                </h2>
                
                {!isEli5 ? (
                  <>
                    <p className="text-[#A1A1A1] leading-relaxed text-lg">
                      FlockML is available as a single NPM package. It contains both the browser-side WebWorker environment (<code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-sm">FlockNode</code>) and the Node.js server-side aggregator (<code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-sm">Coordinator</code>).
                    </p>
                    <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden font-mono text-xs sm:text-sm max-w-full w-full">
                      <div className="px-4 py-2 border-b border-white/5 bg-[#1A1A1A] text-[#888] text-[10px] sm:text-xs flex justify-between items-center">
                        <span>Terminal</span>
                        <button onClick={() => handleCopy('npm install flockml')} className="text-[#555] hover:text-white transition-colors">
                          {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </button>
                      </div>
                      <div className="p-4 overflow-x-auto text-[#E5E5E5] whitespace-nowrap">
                        <span className="text-emerald-500 mr-2">$</span>npm install flockml
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-[#111] p-6 rounded-xl border border-emerald-500/20 space-y-4 max-w-2xl">
                    <p className="text-[#E5E5E5] text-lg leading-relaxed">
                      There is literally nothing for your friends to install! When they walk into your party (visit your website), you automatically hand them a LEGO piece. They don&apos;t have to download any tools or bring anything with them.
                    </p>
                  </div>
                )}
              </section>

              {/* Architecture Overview */}
              <section id="architecture" className="space-y-6 scroll-mt-24 border-t border-white/10 pt-16">
                <h2 className="text-3xl font-bold text-white flex items-center group cursor-pointer">
                  <Hash size={24} className="mr-2 text-[#333] group-hover:text-emerald-500 transition-colors" />
                  Architecture Overview
                </h2>
                
                {!isEli5 ? (
                  <div className="space-y-6">
                    <p className="text-[#A1A1A1] leading-relaxed text-lg">
                      FlockML completely eliminates the need for centralized AWS/GCP GPU clusters. By distributing the training workload across your website visitors&apos; browsers via WebGPU, it enables zero-cost, privacy-preserving machine learning.
                    </p>
                    <p className="text-[#A1A1A1] leading-relaxed text-lg mb-4">
                      The core engine executes five distinct steps per training iteration:
                    </p>
                    <div className="space-y-4">
                      <div className="bg-[#111] border border-white/5 p-4 rounded-xl flex gap-4">
                        <span className="text-emerald-500 font-bold font-mono">1</span>
                        <div><strong className="text-white block mb-1">Model Distribution</strong>The Node.js Coordinator broadcasts the global Float32 weights to connected browser clients via WebSockets.</div>
                      </div>
                      <div className="bg-[#111] border border-white/5 p-4 rounded-xl flex gap-4">
                        <span className="text-emerald-500 font-bold font-mono">2</span>
                        <div><strong className="text-white block mb-1">Local SGD Compute</strong>The browser&apos;s WebWorker computes gradients against local private data using `@tensorflow/tfjs-backend-webgpu`.</div>
                      </div>
                      <div className="bg-[#111] border border-white/5 p-4 rounded-xl flex gap-4">
                        <span className="text-emerald-500 font-bold font-mono">3</span>
                        <div><strong className="text-white block mb-1">Privacy Injection</strong>Laplacian noise is cryptographically injected into the raw gradients before leaving the device.</div>
                      </div>
                      <div className="bg-[#111] border border-white/5 p-4 rounded-xl flex gap-4">
                        <span className="text-emerald-500 font-bold font-mono">4</span>
                        <div><strong className="text-white block mb-1">Quantization</strong>Noisy Float32 gradients are mathematically compressed into 8-Bit Integers and serialized to Protocol Buffers.</div>
                      </div>
                      <div className="bg-[#111] border border-white/5 p-4 rounded-xl flex gap-4">
                        <span className="text-emerald-500 font-bold font-mono">5</span>
                        <div><strong className="text-white block mb-1">Global Aggregation</strong>The server receives the Protobufs, waits for a batch, and executes Federated Averaging (FedAvg).</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-4">
                      <h3 className="text-white font-bold text-xl">The Old Way (Amazon AWS)</h3>
                      <p className="text-[#888] text-sm leading-relaxed">
                        You want to build a giant 100-million piece LEGO castle. So, you hire a massive, expensive construction company to build the castle in a giant warehouse. You pay them $5,000 a month. They do a great job, but it costs all your allowance.
                      </p>
                    </div>
                    <div className="bg-[#111] p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-4">
                      <h3 className="text-white font-bold text-xl">The FlockML Way</h3>
                      <p className="text-[#888] text-sm leading-relaxed">
                        You throw a massive party and invite 10,000 friends (your <strong>Website Visitors</strong>). When they walk in the door, you secretly hand them exactly one LEGO piece and instructions on how to snap it together. They do it automatically!
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* Client Setup */}
              <section id="flocknode" className="space-y-6 scroll-mt-24 border-t border-white/10 pt-16">
                <h2 className="text-3xl font-bold text-white flex items-center group cursor-pointer">
                  <Hash size={24} className="mr-2 text-[#333] group-hover:text-emerald-500 transition-colors" />
                  Client Setup (FlockNode)
                </h2>
                
                {!isEli5 ? (
                  <>
                    <p className="text-[#A1A1A1] leading-relaxed text-lg">
                      The <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-sm">FlockNode</code> is designed to run in the browser. It automatically spawns Web Workers to ensure your UI never drops frames while executing massive matrix operations.
                    </p>
                    <p className="text-[#888] leading-relaxed">
                      Mount the node at the absolute root of your React application (e.g. `layout.tsx`) so it runs persistently across page navigations.
                    </p>
                    <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden max-w-full w-full">
                      <div className="px-4 py-2 border-b border-white/5 bg-[#1A1A1A] text-[#888] text-[10px] sm:text-xs font-mono">app/layout.tsx</div>
                      <div className="p-4 sm:p-6 text-xs sm:text-sm font-mono overflow-x-auto text-[#E5E5E5] leading-relaxed whitespace-nowrap custom-scrollbar">
                        <p><span className="text-purple-400">import</span> {"{ useEffect }"} <span className="text-purple-400">from</span> <span className="text-green-400">&apos;react&apos;</span>;</p>
                        <p><span className="text-purple-400">import</span> {"{ FlockNode }"} <span className="text-purple-400">from</span> <span className="text-green-400">&apos;flockml&apos;</span>;</p>
                        <br />
                        <p><span className="text-purple-400">export default function</span> <span className="text-blue-400">RootLayout</span>({"{ children }"}: {"{ children: React.ReactNode }"}) {"{"}</p>
                        <p className="pl-4"><span className="text-blue-400">useEffect</span>(() {"=>"} {"{"}</p>
                        <p className="pl-8 text-[#888]">{"// 1. Hook into your WebSocket server"}</p>
                        <p className="pl-8">FlockNode.<span className="text-yellow-200">connect</span>(<span className="text-green-400">&apos;wss://api.yourdomain.com/flock&apos;</span>);</p>
                        <br />
                        <p className="pl-8 text-[#888]">{"// 2. Configure Cryptographic Privacy & Hyperparameters"}</p>
                        <p className="pl-8">FlockNode.<span className="text-teal-400">privacyEpsilon</span> = <span className="text-orange-400">1.5</span>;</p>
                        <p className="pl-8">FlockNode.<span className="text-teal-400">batchSize</span> = <span className="text-orange-400">32</span>;</p>
                        <br />
                        <p className="pl-8 text-[#888]">{"// 3. Spawns Web Worker and begins background WebGPU compute"}</p>
                        <p className="pl-8">FlockNode.<span className="text-yellow-200">startTraining</span>();</p>
                        <p className="pl-4">{"}, []);"}</p>
                        <br />
                        <p className="pl-4"><span className="text-purple-400">return</span> {"<html><body>{children}</body></html>"};</p>
                        <p>{"}"}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-4 max-w-2xl">
                    <p className="text-[#E5E5E5] text-lg leading-relaxed">
                      You stand at the front door of the party. As every single friend walks in, you hand them a small instruction manual.
                    </p>
                    <p className="text-[#E5E5E5] text-lg leading-relaxed">
                      The instruction manual says: <strong className="text-emerald-400">&quot;Pick up a blue LEGO, snap it onto a red LEGO, and then go enjoy the party.&quot;</strong> That&apos;s it! They do exactly what they are told without you needing to supervise them.
                    </p>
                  </div>
                )}
              </section>

              {/* Server Setup */}
              <section id="coordinator" className="space-y-6 scroll-mt-24 border-t border-white/10 pt-16">
                <h2 className="text-3xl font-bold text-white flex items-center group cursor-pointer">
                  <Hash size={24} className="mr-2 text-[#333] group-hover:text-emerald-500 transition-colors" />
                  Server Setup (Coordinator)
                </h2>
                
                {!isEli5 ? (
                  <>
                    <p className="text-[#A1A1A1] leading-relaxed text-lg">
                      The <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-sm">Coordinator</code> is the central Node.js authority. As 8-Bit quantized Protobuf payloads stream in from thousands of clients, it queues them up and executes the mathematical FedAvg algorithm.
                    </p>
                    <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden max-w-full w-full">
                      <div className="px-4 py-2 border-b border-white/5 bg-[#1A1A1A] text-[#888] text-[10px] sm:text-xs font-mono">server.ts</div>
                      <div className="p-4 sm:p-6 text-xs sm:text-sm font-mono overflow-x-auto text-[#E5E5E5] leading-relaxed whitespace-nowrap custom-scrollbar">
                        <p><span className="text-purple-400">import</span> {"{ Coordinator }"} <span className="text-purple-400">from</span> <span className="text-green-400">&apos;flockml&apos;</span>;</p>
                        <p><span className="text-purple-400">import</span> {"{ WebSocketServer }"} <span className="text-purple-400">from</span> <span className="text-green-400">&apos;ws&apos;</span>;</p>
                        <br />
                        <p className="text-[#888]">{"// 1. Initialize Network Architecture (Input, Hidden, Output)"}</p>
                        <p><span className="text-purple-400">const</span> coordinator = <span className="text-purple-400">new</span> <span className="text-yellow-200">Coordinator</span>(<span className="text-orange-400">128</span>, <span className="text-orange-400">64</span>, <span className="text-orange-400">10</span>);</p>
                        <p><span className="text-purple-400">const</span> wss = <span className="text-purple-400">new</span> <span className="text-yellow-200">WebSocketServer</span>({"{ port: "}<span className="text-orange-400">8080</span> {"}"});</p>
                        <br />
                        <p>wss.<span className="text-yellow-200">on</span>(<span className="text-green-400">&apos;connection&apos;</span>, (ws) {"=>"} {"{"}</p>
                        <p className="pl-4 text-[#888]">{"// 2. Listen for incoming Protobuf binary payloads"}</p>
                        <p className="pl-4">ws.<span className="text-yellow-200">on</span>(<span className="text-green-400">&apos;message&apos;</span>, (payload: <span className="text-teal-400">Buffer</span>) {"=>"} {"{"}</p>
                        <p className="pl-8">coordinator.<span className="text-yellow-200">receiveUpdate</span>(payload);</p>
                        <p className="pl-4">{"});"}</p>
                        <p>{"});"}</p>
                        <br />
                        <p className="text-[#888]">{"// 3. Execute Federated Averaging every 10 minutes"}</p>
                        <p><span className="text-blue-400">setInterval</span>(() {"=>"} {"{"}</p>
                        <p className="pl-4">coordinator.<span className="text-yellow-200">aggregate</span>();</p>
                        <p className="pl-4 text-[#888]">{"// (Optional) Broadcast updated Float32 weights back to clients"}</p>
                        <p>{"}, "}<span className="text-orange-400">600000</span>{");"}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-4 max-w-2xl">
                    <h3 className="text-emerald-400 font-bold text-xl mb-2">The Magic Bucket</h3>
                    <p className="text-[#E5E5E5] text-lg leading-relaxed">
                      All the spray-painted LEGO pieces are tossed into a giant bucket sitting in the corner of the room (the <strong>Server Coordinator</strong>). 
                    </p>
                    <p className="text-[#E5E5E5] text-lg leading-relaxed">
                      Every 10 minutes, the bucket magically shakes itself (this is <strong>Federated Averaging</strong>) and the pieces snap together perfectly. The castle builds itself, your friends did all the work, and it cost you $0!
                    </p>
                  </div>
                )}
              </section>

              {/* Advanced Configuration */}
              <section id="advanced-config" className="space-y-6 scroll-mt-24 border-t border-white/10 pt-16">
                <h2 className="text-3xl font-bold text-white flex items-center group cursor-pointer">
                  <Hash size={24} className="mr-2 text-[#333] group-hover:text-emerald-500 transition-colors" />
                  {isEli5 ? "Party Rules" : "Advanced Configuration"}
                </h2>
                
                {!isEli5 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    <div className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-3">
                      <h3 className="text-emerald-400 font-mono text-sm">FlockNode.batchSize</h3>
                      <p className="text-[#888] text-sm leading-relaxed">Controls the amount of data processed locally before generating a gradient update.</p>
                      <ul className="text-xs text-[#555] space-y-1 list-disc pl-4">
                        <li><strong>Small (8):</strong> High network chatter, low memory footprint.</li>
                        <li><strong>Large (128):</strong> Minimal chatter, prolonged WebGPU compute.</li>
                      </ul>
                    </div>
                    <div className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-3">
                      <h3 className="text-emerald-400 font-mono text-sm">FlockNode.learningRate</h3>
                      <p className="text-[#888] text-sm leading-relaxed">The step size for local SGD. Because gradients are globally aggregated, keep this strictly lower than centralized ML to prevent global gradient explosion.</p>
                    </div>
                    <div className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-3">
                      <h3 className="text-emerald-400 font-mono text-sm">Coordinator.minClients</h3>
                      <p className="text-[#888] text-sm leading-relaxed">The absolute minimum payloads required before `.aggregate()` executes. Essential to mathematically guarantee Laplacian noise cancellation.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-3">
                      <h3 className="text-emerald-400 font-bold text-lg">How many pieces they hold</h3>
                      <p className="text-[#888] text-sm leading-relaxed">You can tell your friends to only hold 32 pieces at a time so their hands don&apos;t get full (<strong>Batch Size</strong>).</p>
                    </div>
                    <div className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-3">
                      <h3 className="text-emerald-400 font-bold text-lg">How fast they snap</h3>
                      <p className="text-[#888] text-sm leading-relaxed">You can tell them to build slowly and carefully so they don&apos;t break the blocks (<strong>Learning Rate</strong>).</p>
                    </div>
                    <div className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-3">
                      <h3 className="text-emerald-400 font-bold text-lg">Waiting for enough friends</h3>
                      <p className="text-[#888] text-sm leading-relaxed">The magic bucket refuses to shake itself until at least 100 friends have thrown pieces in (<strong>minClients</strong>).</p>
                    </div>
                  </div>
                )}
              </section>

              {/* The 8-Bit Speed Paradox */}
              <section id="speed-paradox" className="space-y-6 scroll-mt-24 border-t border-white/10 pt-16">
                <h2 className="text-3xl font-bold text-white flex items-center group cursor-pointer">
                  <Hash size={24} className="mr-2 text-[#333] group-hover:text-emerald-500 transition-colors" />
                  {isEli5 ? "The Fast Builder Trick" : "The 8-Bit Speed Paradox"}
                </h2>
                
                {!isEli5 ? (
                  <>
                    <p className="text-[#A1A1A1] leading-relaxed text-lg">
                      Compressing a 32-bit floating-point network down to an 8-bit integer array reduces network payloads by exactly 75%. However, this loss of mathematical precision traditionally forces models to take exponentially more epochs to converge. 
                    </p>
                    <div className="space-y-6 mt-8">
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-[#111] border border-white/10 flex items-center justify-center shrink-0 text-emerald-500 font-mono text-sm">1</div>
                        <div>
                          <h4 className="text-white font-bold mb-1">Error Feedback Memory</h4>
                          <p className="text-[#888] leading-relaxed text-sm mb-2">When FlockML compresses gradients to 8-bit using `Q(x) = round((x-min)/(max-min)*255)`, it does not discard the lost decimal data. Instead, it caches the &quot;quantization error&quot; locally in the browser&apos;s IndexedDB.</p>
                          <p className="text-[#888] leading-relaxed text-sm">On the next training loop, the Web Worker retrieves that exact error and adds it back into the new gradient computation. This perfectly offsets the precision loss, ensuring convergence in the exact same number of steps as a pure Float32 network.</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-[#111] border border-white/10 flex items-center justify-center shrink-0 text-emerald-500 font-mono text-sm">2</div>
                        <div>
                          <h4 className="text-white font-bold mb-1">Zero-Latency Serialization</h4>
                          <p className="text-[#888] leading-relaxed text-sm">The Int8 arrays are encoded directly into raw binary Protocol Buffers (not JSON). The resulting payloads are as small as 91 bytes, making WebSocket transmission instantaneous even on 3G mobile networks.</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-4 max-w-2xl">
                    <p className="text-[#E5E5E5] text-lg leading-relaxed">
                      If you force your friends to build super fast, they make mistakes (this is called <strong>8-Bit Quantization Loss</strong>). 
                    </p>
                    <p className="text-[#E5E5E5] text-lg leading-relaxed">
                      But FlockML is smart. It tells your friends to write down exactly where they made a mistake on a piece of paper. The next time they pick up a LEGO block, they look at the paper and fix their previous mistake!
                    </p>
                    <p className="text-[#E5E5E5] text-lg leading-relaxed">
                      This means they can build 100x faster without ever ruining the final castle!
                    </p>
                  </div>
                )}
              </section>

              {/* Differential Privacy */}
              <section id="privacy" className="space-y-6 scroll-mt-24 border-t border-white/10 pt-16">
                <h2 className="text-3xl font-bold text-white flex items-center group cursor-pointer">
                  <Hash size={24} className="mr-2 text-[#333] group-hover:text-emerald-500 transition-colors" />
                  Differential Privacy
                </h2>
                
                {!isEli5 ? (
                  <>
                    <p className="text-[#A1A1A1] leading-relaxed text-lg">
                      FlockML guarantees mathematically provable privacy. Because raw gradients can theoretically be reverse-engineered to expose training data, the Server Coordinator never sees raw gradients.
                    </p>
                    <div className="mt-6 space-y-6">
                      <div className="bg-[#111] p-6 rounded-xl border border-white/5">
                        <h4 className="text-emerald-400 font-mono text-sm mb-3">FlockNode.privacyEpsilon (ε)</h4>
                        <p className="text-[#888] text-sm leading-relaxed mb-4">
                          Before quantization, the browser injects cryptographic noise sampled from a Laplace distribution. The variance of this noise is controlled by the Epsilon parameter.
                        </p>
                        <ul className="text-xs text-[#555] space-y-2 list-disc pl-4">
                          <li><strong>High Epsilon (e.g., 5.0):</strong> Minimal noise injection. Fast convergence, but weaker privacy guarantees.</li>
                          <li><strong>Low Epsilon (e.g., 0.1):</strong> Heavy noise injection. Extreme privacy, but requires massive scale (1000+ `minClients`) to mathematically average out the noise on the server.</li>
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-4 max-w-2xl">
                    <p className="text-[#E5E5E5] text-lg leading-relaxed">
                      You don&apos;t want anyone knowing which friend touched which LEGO piece (because privacy is important). 
                    </p>
                    <p className="text-[#E5E5E5] text-lg leading-relaxed">
                      So before they are allowed to give their finished piece back to you, you make them spray-paint it with a completely random color (this is called <strong>Laplacian Noise</strong>). Now, nobody can ever track who built what!
                    </p>
                  </div>
                )}
              </section>

              {/* Comparison */}
              <section id="comparison" className="space-y-6 scroll-mt-24 border-t border-white/10 pt-16">
                <h2 className="text-3xl font-bold text-white flex items-center group cursor-pointer">
                  <Hash size={24} className="mr-2 text-[#333] group-hover:text-emerald-500 transition-colors" />
                  {isEli5 ? "Why this is better" : "FlockML vs Cloud AI"}
                </h2>
                
                <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#0A0A0A] w-full max-w-full">
                  <table className="w-full min-w-[500px] text-left text-xs sm:text-sm">
                    <thead className="bg-[#111] border-b border-white/10 text-[#A1A1A1] font-mono text-xs uppercase">
                      <tr>
                        <th className="px-6 py-4">Metric</th>
                        <th className="px-6 py-4 text-white">FlockML (The Party)</th>
                        <th className="px-6 py-4">Traditional Cloud AI (The Company)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="px-6 py-4 text-[#888]">Cost</td>
                        <td className="px-6 py-4 text-emerald-400 font-medium">$0 (Free Compute)</td>
                        <td className="px-6 py-4 text-[#E5E5E5]">$5,000 / month</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-[#888]">Privacy</td>
                        <td className="px-6 py-4 text-emerald-400 font-medium">100% Private (Differential)</td>
                        <td className="px-6 py-4 text-[#E5E5E5]">Vulnerable Centralized Data</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-[#888]">Scalability</td>
                        <td className="px-6 py-4 text-emerald-400 font-medium">Infinite (Scales with Traffic)</td>
                        <td className="px-6 py-4 text-[#E5E5E5]">Bottlenecked by server limits</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
