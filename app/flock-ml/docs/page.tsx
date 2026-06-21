"use client";

import React, { useState } from 'react';
import { Copy, Check, Hash } from 'lucide-react';

export default function FlockDocsPage() {
  const [copied, setCopied] = useState(false);

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
              <a href="#dual-distribution" className="hover:text-white transition-colors">Dual Distribution Strategy</a>
              <a href="#architecture" className="hover:text-white transition-colors">Architecture Overview</a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Client API (Browser)</h4>
            <div className="flex flex-col space-y-2 text-sm font-medium text-[#888]">
              <a href="#flocknode" className="hover:text-white transition-colors">FlockNode</a>
              <a href="#web-workers" className="hover:text-white transition-colors">Web Worker Offloading</a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Server API (Node.js)</h4>
            <div className="flex flex-col space-y-2 text-sm font-medium text-[#888]">
              <a href="#coordinator" className="hover:text-white transition-colors">Coordinator</a>
              <a href="#advanced-config" className="hover:text-white transition-colors">Advanced Config</a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Cryptography & Math</h4>
            <div className="flex flex-col space-y-2 text-sm font-medium text-[#888]">
              <a href="/flock-ml/math" className="hover:text-white transition-colors">Differential Privacy</a>
              <a href="/flock-ml/math" className="hover:text-white transition-colors">8-Bit Quantization</a>
              <a href="#speed-paradox" className="hover:text-white transition-colors">The 8-Bit Speed Paradox</a>
              <a href="/flock-ml/math" className="hover:text-white transition-colors">Federated Averaging</a>
            </div>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="flex-1 min-w-0 space-y-24">
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">FlockML Documentation</h1>
            <p className="text-xl text-[#A1A1A1] font-light leading-relaxed max-w-2xl">
              Learn how to integrate the open-source federated learning infrastructure into your React and Node.js applications.
            </p>
          </div>

          {/* Installation */}
          <section id="installation" className="space-y-6 scroll-mt-24">
            <h2 className="text-3xl font-bold text-white flex items-center group cursor-pointer">
              <Hash size={24} className="mr-2 text-[#333] group-hover:text-emerald-500 transition-colors" />
              Installation
            </h2>
            <p className="text-[#A1A1A1] leading-relaxed text-lg">
              FlockML is available as an NPM package. It contains both the browser-side <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-sm">FlockNode</code> and the server-side <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-sm">Coordinator</code>.
            </p>
            
            <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden font-mono text-sm max-w-2xl">
              <div className="px-4 py-2 border-b border-white/5 bg-[#1A1A1A] text-[#888] text-xs flex justify-between items-center">
                <span>Terminal</span>
                <button onClick={() => handleCopy('npm install flock-ml')} className="text-[#555] hover:text-white transition-colors">
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>
              <div className="p-4 text-[#E5E5E5]">
                <span className="text-emerald-500 mr-2">$</span>npm install flock-ml
              </div>
            </div>
          </section>

          {/* Dual Distribution */}
          <section id="dual-distribution" className="space-y-6 scroll-mt-24 border-t border-white/10 pt-16">
            <h2 className="text-3xl font-bold text-white flex items-center group cursor-pointer">
              <Hash size={24} className="mr-2 text-[#333] group-hover:text-emerald-500 transition-colors" />
              Dual Distribution Strategy
            </h2>
            <p className="text-[#A1A1A1] leading-relaxed text-lg">
              FlockML is designed to be completely frictionless whether you are building a new AI startup from scratch or integrating into an enterprise legacy system. We provide two separate implementation paths:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-4">
                <div className="text-emerald-400 font-mono text-sm mb-2 border border-emerald-500/20 bg-emerald-500/10 inline-block px-2 py-1 rounded">For Old Projects</div>
                <h3 className="text-white font-bold text-xl">The Drop-in SDK</h3>
                <p className="text-[#888] text-sm leading-relaxed">Install via <code className="bg-white/10 px-1 rounded text-white text-xs">npm install flock-ml</code>. Import the <code className="bg-white/10 px-1 rounded text-white text-xs">{"<FlockNode />"}</code> component into your existing React or Vanilla JS application. It immediately hooks into your frontend without disrupting your current architecture or build steps.</p>
              </div>
              <div className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-4">
                <div className="text-purple-400 font-mono text-sm mb-2 border border-purple-500/20 bg-purple-500/10 inline-block px-2 py-1 rounded">For New Projects</div>
                <h3 className="text-white font-bold text-xl">The Scaffold CLI</h3>
                <p className="text-[#888] text-sm leading-relaxed">Run <code className="bg-white/10 px-1 rounded text-white text-xs">npx create-flock-app</code>. This instantly generates a boilerplate Next.js frontend alongside a pre-configured Python or Node.js backend. You get a production-ready Federated Learning loop running in under 60 seconds.</p>
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
              Standard AI training requires massive centralized GPU clusters. FlockML reverses this by shipping the neural network directly to your users&apos; browsers via WebAssembly/WebGPU. 
            </p>
            <p className="text-[#A1A1A1] leading-relaxed text-lg">
              When a user visits your website, a background Web Worker silently computes gradients on local data. It then encrypts these gradients with <strong>Laplacian Noise</strong>, compresses them into <strong>8-Bit Integers</strong>, and transmits them to your Node.js server via WebSockets.
            </p>
          </section>

          {/* Client Setup */}
          <section id="flocknode" className="space-y-6 scroll-mt-24 border-t border-white/10 pt-16">
            <h2 className="text-3xl font-bold text-white flex items-center group cursor-pointer">
              <Hash size={24} className="mr-2 text-[#333] group-hover:text-emerald-500 transition-colors" />
              Client Integration (React)
            </h2>
            <p className="text-[#A1A1A1] leading-relaxed text-lg">
              Initialize the <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-sm">FlockNode</code> at the root of your application. It runs entirely off the main thread, ensuring your React UI maintains 60fps.
            </p>

            <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden max-w-3xl">
              <div className="px-4 py-2 border-b border-white/5 bg-[#1A1A1A] text-[#888] text-xs font-mono">app/layout.tsx</div>
              <div className="p-6 text-sm font-mono overflow-x-auto text-[#E5E5E5] leading-relaxed">
                <p><span className="text-purple-400">import</span> {"{ useEffect }"} <span className="text-purple-400">from</span> <span className="text-green-400">&apos;react&apos;</span>;</p>
                <p><span className="text-purple-400">import</span> {"{ FlockNode }"} <span className="text-purple-400">from</span> <span className="text-green-400">&apos;flock-ml&apos;</span>;</p>
                <br />
                <p><span className="text-purple-400">export default function</span> <span className="text-blue-400">RootLayout</span>({"{ children }"}: {"{ children: React.ReactNode }"}) {"{"}</p>
                <p className="pl-4"><span className="text-blue-400">useEffect</span>(() {"=>"} {"{"}</p>
                <p className="pl-8 text-[#888]">{"// 1. Hook into your WebSocket server"}</p>
                <p className="pl-8">FlockNode.<span className="text-yellow-200">connect</span>(<span className="text-green-400">&apos;wss://api.yourdomain.com/flock&apos;</span>);</p>
                <br />
                <p className="pl-8 text-[#888]">{"// 2. Set Privacy parameters (Higher Epsilon = Less Noise)"}</p>
                <p className="pl-8">FlockNode.<span className="text-teal-400">privacyEpsilon</span> = <span className="text-orange-400">1.5</span>;</p>
                <br />
                <p className="pl-8 text-[#888]">{"// 3. Spawns Web Worker and begins background compute"}</p>
                <p className="pl-8">FlockNode.<span className="text-yellow-200">startTraining</span>();</p>
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

            <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden max-w-3xl">
              <div className="px-4 py-2 border-b border-white/5 bg-[#1A1A1A] text-[#888] text-xs font-mono">server.ts</div>
              <div className="p-6 text-sm font-mono overflow-x-auto text-[#E5E5E5] leading-relaxed">
                <p><span className="text-purple-400">import</span> {"{ Coordinator }"} <span className="text-purple-400">from</span> <span className="text-green-400">&apos;flock-ml&apos;</span>;</p>
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

          {/* Advanced Configuration */}
          <section id="advanced-config" className="space-y-6 scroll-mt-24 border-t border-white/10 pt-16">
            <h2 className="text-3xl font-bold text-white flex items-center group cursor-pointer">
              <Hash size={24} className="mr-2 text-[#333] group-hover:text-emerald-500 transition-colors" />
              Advanced Configuration
            </h2>
            <p className="text-[#A1A1A1] leading-relaxed text-lg">
              FlockML exposes several deep-level configurations to fine-tune the training behavior on edge devices, enabling you to strictly control the CPU and bandwidth usage of your website visitors.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-3">
                <h3 className="text-emerald-400 font-mono text-sm">FlockNode.batchSize</h3>
                <p className="text-[#888] text-sm leading-relaxed">Controls the amount of data processed locally before generating a gradient update. Smaller batch sizes lead to more frequent WebSocket transmissions but lower memory usage. Default is <code className="bg-white/10 px-1 rounded text-white">32</code>.</p>
              </div>
              <div className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-3">
                <h3 className="text-emerald-400 font-mono text-sm">FlockNode.learningRate</h3>
                <p className="text-[#888] text-sm leading-relaxed">The step size for local SGD. Because gradients are aggregated globally via FedAvg, it&apos;s recommended to keep local learning rates slightly lower to prevent gradient explosion. Default is <code className="bg-white/10 px-1 rounded text-white">0.01</code>.</p>
              </div>
              <div className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-3">
                <h3 className="text-emerald-400 font-mono text-sm">Coordinator.minClients</h3>
                <p className="text-[#888] text-sm leading-relaxed">The minimum number of Web Workers required before the Coordinator performs an aggregation step. Essential for Differential Privacy to ensure noise cancels out. Default is <code className="bg-white/10 px-1 rounded text-white">100</code>.</p>
              </div>
              <div className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-3">
                <h3 className="text-emerald-400 font-mono text-sm">Coordinator.compression</h3>
                <p className="text-[#888] text-sm leading-relaxed">Toggle 8-bit Quantization logic. Enabled by default. Turning this off falls back to standard 32-bit Float arrays which increases payload size by 400%.</p>
              </div>
            </div>
          </section>

          {/* The 8-Bit Speed Paradox */}
          <section id="speed-paradox" className="space-y-6 scroll-mt-24 border-t border-white/10 pt-16">
            <h2 className="text-3xl font-bold text-white flex items-center group cursor-pointer">
              <Hash size={24} className="mr-2 text-[#333] group-hover:text-emerald-500 transition-colors" />
              The 8-Bit Speed Paradox
            </h2>
            <p className="text-[#A1A1A1] leading-relaxed text-lg">
              Compressing 32-bit floating-point numbers down to 8-bit integers fundamentally loses mathematical precision. In standard AI training, this loss of precision forces the model to take more epochs (more time) to converge. So why does FlockML use 8-bit?
            </p>
            <p className="text-white font-medium text-lg mt-4">
              Because in a decentralized environment, 8-bit training is actually significantly faster.
            </p>

            <div className="space-y-6 mt-8">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#111] border border-white/10 flex items-center justify-center shrink-0 text-emerald-500 font-mono text-sm">1</div>
                <div>
                  <h4 className="text-white font-bold mb-1">Error Feedback Memory</h4>
                  <p className="text-[#888] leading-relaxed text-sm">When FlockML compresses gradients to 8-bit, it does not discard the lost decimal data. Instead, it caches the &quot;quantization error&quot; locally in the browser. On the next training loop, it adds that error back in. This mathematical trick ensures the model converges in the exact same number of steps as full 32-bit precision.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#111] border border-white/10 flex items-center justify-center shrink-0 text-emerald-500 font-mono text-sm">2</div>
                <div>
                  <h4 className="text-white font-bold mb-1">Network Latency Dominance</h4>
                  <p className="text-[#888] leading-relaxed text-sm">The primary bottleneck in Federated Learning is the internet, not the GPU. Sending 100MB 32-bit payloads over WebSockets takes seconds. Shrinking payloads to 25MB (via 8-bit quantization) removes network latency entirely, allowing the browser to process drastically more training loops per minute.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#111] border border-white/10 flex items-center justify-center shrink-0 text-emerald-500 font-mono text-sm">3</div>
                <div>
                  <h4 className="text-white font-bold mb-1">Massive Asynchronous Parallelism</h4>
                  <p className="text-[#888] leading-relaxed text-sm">One AWS A100 GPU is fast, but it computes sequentially. FlockML leverages web traffic to achieve massive concurrency. 10,000 visitors mean 10,000 edge GPUs processing gradients in parallel. The aggregate throughput heavily outperforms single-node cloud clusters.</p>
                </div>
              </div>
            </div>
          </section>

          {/* How it Compares */}
          <section className="space-y-6 scroll-mt-24 border-t border-white/10 pt-16">
            <h2 className="text-3xl font-bold text-white flex items-center group cursor-pointer">
              <Hash size={24} className="mr-2 text-[#333] group-hover:text-emerald-500 transition-colors" />
              FlockML vs Traditional ML
            </h2>
            <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#0A0A0A]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#111] border-b border-white/10 text-[#A1A1A1] font-mono text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">Metric</th>
                    <th className="px-6 py-4 text-white">FlockML (Decentralized)</th>
                    <th className="px-6 py-4">Traditional Cloud AI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-6 py-4 text-[#888]">Compute Cost</td>
                    <td className="px-6 py-4 text-emerald-400 font-medium">$0 (Crowdsourced)</td>
                    <td className="px-6 py-4 text-[#E5E5E5]">$3.00+ / hr per GPU</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-[#888]">Data Privacy</td>
                    <td className="px-6 py-4 text-emerald-400 font-medium">100% Private (Data stays local)</td>
                    <td className="px-6 py-4 text-[#E5E5E5]">Shipped to external servers</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-[#888]">Scalability</td>
                    <td className="px-6 py-4 text-emerald-400 font-medium">Scales linearly with Web Traffic</td>
                    <td className="px-6 py-4 text-[#E5E5E5]">Bottlenecked by server limits</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-[#888]">Payload Size</td>
                    <td className="px-6 py-4 text-emerald-400 font-medium">~15KB (8-Bit Quantized)</td>
                    <td className="px-6 py-4 text-[#E5E5E5]">~60KB (32-Bit Float)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
