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
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-start gap-16">
        
        {/* Left Sidebar (Sticky) */}
        <aside className="hidden lg:block sticky top-24 w-64 shrink-0 space-y-8 overflow-y-auto max-h-[calc(100vh-6rem)] custom-scrollbar pb-10">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Getting Started</h4>
            <div className="flex flex-col space-y-2 text-sm font-medium text-[#888]">
              <a href="#installation" className="hover:text-white transition-colors">Installation</a>
              <a href="#dual-distribution" className="hover:text-white transition-colors">Distribution Strategy</a>
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
                  : "Learn how to integrate the open-source federated learning infrastructure into your React and Node.js applications."}
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
                      FlockML is available as an NPM package. It contains both the browser-side <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-sm">FlockNode</code> and the server-side <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-sm">Coordinator</code>.
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
                      There is literally nothing for your friends to install! When they walk into your party (visit your website), you automatically hand them a LEGO piece. They don't have to download any tools or bring anything with them.
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
                  <>
                    <p className="text-[#A1A1A1] leading-relaxed text-lg">
                      Standard AI training requires massive centralized GPU clusters. FlockML reverses this by shipping the neural network directly to your users&apos; browsers via WebGPU. 
                    </p>
                    <p className="text-[#A1A1A1] leading-relaxed text-lg">
                      When a user visits your website, a background Web Worker silently computes gradients on local data. It then encrypts these gradients with <strong>Laplacian Noise</strong>, compresses them into <strong>8-Bit Integers</strong>, and transmits them to your Node.js server via WebSockets.
                    </p>
                  </>
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
                  Client Integration
                </h2>
                
                {!isEli5 ? (
                  <>
                    <p className="text-[#A1A1A1] leading-relaxed text-lg">
                      Initialize the <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-sm">FlockNode</code> at the root of your application. It runs entirely off the main thread, ensuring your React UI maintains 60fps.
                    </p>
                    <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden max-w-full w-full">
                      <div className="px-4 py-2 border-b border-white/5 bg-[#1A1A1A] text-[#888] text-[10px] sm:text-xs font-mono">app/layout.tsx</div>
                      <div className="p-4 sm:p-6 text-xs sm:text-sm font-mono overflow-x-auto text-[#E5E5E5] leading-relaxed whitespace-nowrap custom-scrollbar">
                        <p><span className="text-purple-400">import</span> {"{ useEffect }"} <span className="text-purple-400">from</span> <span className="text-green-400">&apos;react&apos;</span>;</p>
                        <p><span className="text-purple-400">import</span> {"{ FlockNode }"} <span className="text-purple-400">from</span> <span className="text-green-400">&apos;flockml&apos;</span>;</p>
                        <br />
                        <p><span className="text-purple-400">export default function</span> <span className="text-blue-400">RootLayout</span>({"{ children }"}: {"{ children: React.ReactNode }"}) {"{"}</p>
                        <p className="pl-4"><span className="text-blue-400">useEffect</span>(() {"=>"} {"{"}</p>
                        <p className="pl-8 text-[#888]">{"// Hook into your WebSocket server"}</p>
                        <p className="pl-8">FlockNode.<span className="text-yellow-200">connect</span>(<span className="text-green-400">&apos;wss://api.yourdomain.com/flock&apos;</span>);</p>
                        <br />
                        <p className="pl-8 text-[#888]">{"// Set Privacy parameters (Higher Epsilon = Less Noise)"}</p>
                        <p className="pl-8">FlockNode.<span className="text-teal-400">privacyEpsilon</span> = <span className="text-orange-400">1.5</span>;</p>
                        <br />
                        <p className="pl-8 text-[#888]">{"// Spawns Web Worker and begins background compute"}</p>
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
                      You don't want anyone knowing which friend touched which LEGO piece (because privacy is important). 
                    </p>
                    <p className="text-[#E5E5E5] text-lg leading-relaxed">
                      So before they are allowed to give their finished piece back to you, you make them spray-paint it with a completely random color (this is called <strong>Differential Privacy</strong>). Now, nobody can track who built what!
                    </p>
                  </div>
                )}
              </section>

              {/* Server Setup */}
              <section id="coordinator" className="space-y-6 scroll-mt-24 border-t border-white/10 pt-16">
                <h2 className="text-3xl font-bold text-white flex items-center group cursor-pointer">
                  <Hash size={24} className="mr-2 text-[#333] group-hover:text-emerald-500 transition-colors" />
                  Server Integration
                </h2>
                
                {!isEli5 ? (
                  <>
                    <p className="text-[#A1A1A1] leading-relaxed text-lg">
                      The <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-sm">Coordinator</code> class manages the global weights. As quantized payloads stream in from clients via WebSocket, it queues them up and executes the Federated Averaging algorithm.
                    </p>
                    <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden max-w-full w-full">
                      <div className="px-4 py-2 border-b border-white/5 bg-[#1A1A1A] text-[#888] text-[10px] sm:text-xs font-mono">server.ts</div>
                      <div className="p-4 sm:p-6 text-xs sm:text-sm font-mono overflow-x-auto text-[#E5E5E5] leading-relaxed whitespace-nowrap custom-scrollbar">
                        <p><span className="text-purple-400">import</span> {"{ Coordinator }"} <span className="text-purple-400">from</span> <span className="text-green-400">&apos;flockml&apos;</span>;</p>
                        <p><span className="text-purple-400">import</span> {"{ WebSocketServer }"} <span className="text-purple-400">from</span> <span className="text-green-400">&apos;ws&apos;</span>;</p>
                        <br />
                        <p className="text-[#888]">{"// Initialize network architecture"}</p>
                        <p><span className="text-purple-400">const</span> coordinator = <span className="text-purple-400">new</span> <span className="text-yellow-200">Coordinator</span>(<span className="text-orange-400">128</span>, <span className="text-orange-400">64</span>, <span className="text-orange-400">10</span>);</p>
                        <p><span className="text-purple-400">const</span> wss = <span className="text-purple-400">new</span> <span className="text-yellow-200">WebSocketServer</span>({"{ port: "}<span className="text-orange-400">8080</span> {"}"});</p>
                        <br />
                        <p>wss.<span className="text-yellow-200">on</span>(<span className="text-green-400">&apos;connection&apos;</span>, (ws) {"=>"} {"{"}</p>
                        <p className="pl-4">ws.<span className="text-yellow-200">on</span>(<span className="text-green-400">&apos;message&apos;</span>, (payload) {"=>"} {"{"}</p>
                        <p className="pl-8">coordinator.<span className="text-yellow-200">receiveUpdate</span>(payload);</p>
                        <p className="pl-4">{"});"}</p>
                        <p>{"});"}</p>
                        <br />
                        <p className="text-[#888]">{"// Run FedAvg every 10 minutes"}</p>
                        <p><span className="text-blue-400">setInterval</span>(() {"=>"} {"{"}</p>
                        <p className="pl-4">coordinator.<span className="text-yellow-200">aggregate</span>();</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-3">
                      <h3 className="text-emerald-400 font-mono text-sm">FlockNode.batchSize</h3>
                      <p className="text-[#888] text-sm leading-relaxed">Controls the amount of data processed locally before generating a gradient update. Smaller batch sizes lead to more frequent WebSocket transmissions but lower memory usage.</p>
                    </div>
                    <div className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-3">
                      <h3 className="text-emerald-400 font-mono text-sm">FlockNode.learningRate</h3>
                      <p className="text-[#888] text-sm leading-relaxed">The step size for local SGD. Because gradients are aggregated globally via FedAvg, it&apos;s recommended to keep local learning rates slightly lower to prevent gradient explosion.</p>
                    </div>
                    <div className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-3">
                      <h3 className="text-emerald-400 font-mono text-sm">Coordinator.minClients</h3>
                      <p className="text-[#888] text-sm leading-relaxed">The minimum number of Web Workers required before the Coordinator performs an aggregation step. Essential for Differential Privacy to ensure noise cancels out.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-3">
                      <h3 className="text-emerald-400 font-bold text-lg">How many pieces they hold</h3>
                      <p className="text-[#888] text-sm leading-relaxed">You can tell your friends to only hold 32 pieces at a time so their hands don't get full (<strong>Batch Size</strong>).</p>
                    </div>
                    <div className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-3">
                      <h3 className="text-emerald-400 font-bold text-lg">How fast they snap</h3>
                      <p className="text-[#888] text-sm leading-relaxed">You can tell them to build slowly and carefully so they don't break the blocks (<strong>Learning Rate</strong>).</p>
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
                      Compressing 32-bit floating-point numbers down to 8-bit integers fundamentally loses mathematical precision. In standard AI training, this loss of precision forces the model to take more epochs (more time) to converge. So why does FlockML use 8-bit?
                    </p>
                    <div className="space-y-6 mt-8">
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-[#111] border border-white/10 flex items-center justify-center shrink-0 text-emerald-500 font-mono text-sm">1</div>
                        <div>
                          <h4 className="text-white font-bold mb-1">Error Feedback Memory</h4>
                          <p className="text-[#888] leading-relaxed text-sm">When FlockML compresses gradients to 8-bit, it does not discard the lost decimal data. Instead, it caches the &quot;quantization error&quot; locally in the browser. On the next training loop, it adds that error back in. This ensures the model converges in the exact same number of steps.</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-[#111] border border-white/10 flex items-center justify-center shrink-0 text-emerald-500 font-mono text-sm">2</div>
                        <div>
                          <h4 className="text-white font-bold mb-1">Network Latency Dominance</h4>
                          <p className="text-[#888] leading-relaxed text-sm">The primary bottleneck in Federated Learning is the internet. Shrinking payloads to exactly 91 bytes via Protobufs removes network latency entirely.</p>
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
                        <td className="px-6 py-4 text-emerald-400 font-medium">$0 (Free Pizza)</td>
                        <td className="px-6 py-4 text-[#E5E5E5]">$5,000 / month</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-[#888]">Privacy</td>
                        <td className="px-6 py-4 text-emerald-400 font-medium">100% Private (Spray-painted)</td>
                        <td className="px-6 py-4 text-[#E5E5E5]">They steal your data</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-[#888]">Scalability</td>
                        <td className="px-6 py-4 text-emerald-400 font-medium">10,000 friends = 10,000 workers</td>
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
