"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Cpu, Shield, Globe, Award, Sparkles } from 'lucide-react';
import { FlockNode } from '@/lib/federated/client-node';

// Toy dataset: XOR Logic Gate
// Classic non-linear ML baseline
const XOR_DATA = [
  { inputs: [0, 0], targets: [0] },
  { inputs: [0, 1], targets: [1] },
  { inputs: [1, 0], targets: [1] },
  { inputs: [1, 1], targets: [0] }
];

export default function MeityDemoPage() {
  const [node, setNode] = useState<FlockNode | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(0.5);
  const [epsilon, setEpsilon] = useState(0.5);
  const [inputA, setInputA] = useState(0);
  const [inputB, setInputB] = useState(1);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [secureGrads, setSecureGrads] = useState<any>(null);

  const trainingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize client node
  useEffect(() => {
    const initializedNode = new FlockNode(2, 4, 1);
    initializedNode.connect('wss://national-ai-grid.gov.in/flock');
    setNode(initializedNode);
    addLog("System initialized. FlockNode configured: 2 Input, 4 Hidden, 1 Output.");
    addLog("WebAssembly compute engine ready. WebGPU detection initialized.");
    
    // Initial prediction
    const res = initializedNode.network.predict([0, 1]);
    setPrediction(res[0]);
  }, []);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 15)]);
  };

  // Run prediction helper
  const runPrediction = (a: number, b: number, customNode = node) => {
    if (!customNode) return;
    const res = customNode.network.predict([a, b]);
    setPrediction(res[0]);
  };

  const handleStartTraining = () => {
    if (!node) return;
    setIsTraining(true);
    addLog("Starting training loop natively in user browser thread...");

    trainingIntervalRef.current = setInterval(() => {
      // Train for 20 epochs per render step to speed up visual updates
      let currentLoss = 0;
      for (let steps = 0; steps < 30; steps++) {
        // Run forward/backward passes on our batch
        for (const data of XOR_DATA) {
          node.trainLocalBatch([data.inputs], [data.targets]);
        }
      }

      // Calculate current loss/error on the XOR outputs
      let errorSum = 0;
      XOR_DATA.forEach(data => {
        const pred = node.network.predict(data.inputs)[0];
        errorSum += Math.pow(data.targets[0] - pred, 2);
      });
      currentLoss = errorSum / XOR_DATA.length;

      setEpoch(prev => {
        const nextEpoch = prev + 30;
        
        // Push stats
        if (nextEpoch % 300 === 0) {
          addLog(`Epoch ${nextEpoch} - Loss: ${currentLoss.toFixed(6)}`);
        }

        // Auto stop if target loss reached
        if (currentLoss < 0.005) {
          clearInterval(trainingIntervalRef.current!);
          setIsTraining(false);
          addLog(`Model converged! Target loss achieved at epoch ${nextEpoch}.`);
        }

        return nextEpoch;
      });

      setLoss(currentLoss);
      runPrediction(inputA, inputB, node);
    }, 50);
  };

  const handlePauseTraining = () => {
    if (trainingIntervalRef.current) {
      clearInterval(trainingIntervalRef.current);
    }
    setIsTraining(false);
    addLog("Training paused. Model state preserved in local client memory.");
  };

  const handleReset = () => {
    if (trainingIntervalRef.current) {
      clearInterval(trainingIntervalRef.current);
    }
    setIsTraining(false);
    setEpoch(0);
    setLoss(0.5);
    setSecureGrads(null);
    const freshNode = new FlockNode(2, 4, 1);
    freshNode.connect('wss://national-ai-grid.gov.in/flock');
    setNode(freshNode);
    runPrediction(inputA, inputB, freshNode);
    setLogs([]);
    addLog("Weights randomized. Model reset to initial untrained state.");
  };

  const handleExportSecuredGradients = () => {
    if (!node) return;
    node.privacyEpsilon = epsilon;
    const grads = node.exportSecureGradients();
    setSecureGrads(grads);
    addLog(`Applying Differential Privacy (ε = ${epsilon}). Gradients quantized to 8-bit.`);
    addLog("Payload encrypted. Ready for upload to global aggregator server.");
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans selection:bg-white selection:text-black overflow-x-hidden pt-28 pb-32 relative">
      
      {/* Subtle background layers */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(16,185,129,0.04) 0%, transparent 65%)' }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Flag Badge & Title */}
        <div className="flex flex-col gap-1.5 mb-10">
          <div className="inline-flex items-center gap-2 self-start bg-white/[0.04] border border-white/10 px-3.5 py-1.5 rounded-full mb-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-400">
              National Sovereign Compute Initiative
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            FlockML <span className="text-zinc-500">× MeitY Pilot</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed mt-1">
            Proof-of-Concept: Training a neural network directly inside your web browser. No external API queries, zero cloud billing, with native edge-side privacy verification.
          </p>
        </div>

        {/* Grid Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Live Controller */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Live Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#0d0d0d] border border-white/[0.06] p-6 rounded-none">
              <div className="space-y-1">
                <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-500 flex items-center gap-1.5">
                  <Cpu size={12} className="text-zinc-500" /> Compute Node
                </span>
                <p className="text-sm font-bold text-white font-mono uppercase">User Browser</p>
              </div>
              <div className="space-y-1 border-l border-white/[0.06] pl-4">
                <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-500">Model Epochs</span>
                <p className="text-xl font-black text-white font-mono">{epoch}</p>
              </div>
              <div className="space-y-1 border-l border-white/[0.06] pl-4">
                <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-500">Training Loss</span>
                <p className="text-xl font-black text-emerald-400 font-mono">
                  {loss === 0.5 ? "Untrained" : loss.toFixed(6)}
                </p>
              </div>
              <div className="space-y-1 border-l border-white/[0.06] pl-4">
                <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-500">Server Invoice</span>
                <p className="text-xl font-black text-white font-mono">$0.00</p>
              </div>
            </div>

            {/* Live Visualizer Box */}
            <div className="bg-[#0c0c0c] border border-white/[0.08] p-6 sm:p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-zinc-600 uppercase tracking-widest pointer-events-none">
                Topology: 2-4-1
              </div>

              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-400 animate-pulse" /> Network Architecture Output
              </h2>

              {/* Training Controls */}
              <div className="flex flex-wrap gap-3">
                {!isTraining ? (
                  <button
                    onClick={handleStartTraining}
                    className="flex items-center gap-2 bg-white text-black hover:bg-zinc-200 text-xs font-mono uppercase tracking-widest px-5 py-3 font-bold transition-all"
                  >
                    <Play size={12} fill="black" /> Train Model Local
                  </button>
                ) : (
                  <button
                    onClick={handlePauseTraining}
                    className="flex items-center gap-2 border border-amber-500/30 text-amber-500 hover:bg-amber-500/10 text-xs font-mono uppercase tracking-widest px-5 py-3 font-bold transition-all"
                  >
                    <Pause size={12} fill="currentColor" /> Pause Training
                  </button>
                )}

                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white text-xs font-mono uppercase tracking-widest px-4 py-3 transition-all"
                >
                  <RotateCcw size={12} /> Reset Model
                </button>
              </div>

              {/* Graphical Box */}
              <div className="h-44 sm:h-52 border border-white/[0.04] bg-[#090909] relative flex items-center justify-center p-4">
                
                {/* Node visualization layout */}
                <div className="flex justify-between items-center w-full max-w-md h-full relative">
                  
                  {/* Lines behind */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <line x1="10%" y1="30%" x2="50%" y2="20%" stroke="white" strokeWidth="1" />
                    <line x1="10%" y1="30%" x2="50%" y2="40%" stroke="white" strokeWidth="1" />
                    <line x1="10%" y1="30%" x2="50%" y2="60%" stroke="white" strokeWidth="1" />
                    <line x1="10%" y1="30%" x2="50%" y2="80%" stroke="white" strokeWidth="1" />

                    <line x1="10%" y1="70%" x2="50%" y2="20%" stroke="white" strokeWidth="1" />
                    <line x1="10%" y1="70%" x2="50%" y2="40%" stroke="white" strokeWidth="1" />
                    <line x1="10%" y1="70%" x2="50%" y2="60%" stroke="white" strokeWidth="1" />
                    <line x1="10%" y1="70%" x2="50%" y2="80%" stroke="white" strokeWidth="1" />

                    <line x1="50%" y1="20%" x2="90%" y2="50%" stroke="white" strokeWidth="1" />
                    <line x1="50%" y1="40%" x2="90%" y2="50%" stroke="white" strokeWidth="1" />
                    <line x1="50%" y1="60%" x2="90%" y2="50%" stroke="white" strokeWidth="1" />
                    <line x1="50%" y1="80%" x2="90%" y2="50%" stroke="white" strokeWidth="1" />
                  </svg>

                  {/* Input Nodes */}
                  <div className="flex flex-col gap-12 z-10">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs border ${inputA === 1 ? 'bg-white text-black border-white' : 'border-white/20 text-zinc-500'}`}>A</div>
                      <span className="font-mono text-[9px] text-zinc-600 mt-1">[{inputA}]</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs border ${inputB === 1 ? 'bg-white text-black border-white' : 'border-white/20 text-zinc-500'}`}>B</div>
                      <span className="font-mono text-[9px] text-zinc-600 mt-1">[{inputB}]</span>
                    </div>
                  </div>

                  {/* Hidden Nodes */}
                  <div className="flex flex-col gap-5 z-10">
                    {[1, 2, 3, 4].map((nodeIdx) => (
                      <div
                        key={nodeIdx}
                        className={`w-6 h-6 rounded-full border transition-all duration-300 ${isTraining ? 'border-emerald-500/50 bg-emerald-500/[0.04]' : 'border-white/10'}`}
                      />
                    ))}
                  </div>

                  {/* Output Node */}
                  <div className="flex flex-col items-center z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs border transition-all duration-500 ${prediction && prediction > 0.5 ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400' : 'border-white/20 text-zinc-500'}`}>
                      {prediction !== null ? prediction.toFixed(3) : "?"}
                    </div>
                    <span className="font-mono text-[9px] text-zinc-600 mt-1">Prediction</span>
                  </div>

                </div>

                {/* Status indicator absolute */}
                <div className="absolute bottom-3 left-4 font-mono text-[9px] text-zinc-600 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isTraining ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
                  {isTraining ? 'COMPUTE STATE: CALCULATING WEIGHT GRADIENTS' : 'COMPUTE STATE: IDLE'}
                </div>
              </div>
            </div>

            {/* Sandbox Interrogation Station */}
            <div className="bg-[#0c0c0c] border border-white/[0.08] p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Shield size={16} className="text-zinc-400" /> Interactive Model Interrogation
                </h2>
                <p className="text-zinc-500 text-xs mt-1">
                  Change the inputs below to immediately verify if the locally trained weights correctly calculate the non-linear XOR logic gate.
                </p>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6">
                <div className="space-y-2">
                  <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-500">Input A</span>
                  <div className="flex border border-white/10 rounded-none overflow-hidden font-mono text-xs">
                    <button
                      onClick={() => { setInputA(0); runPrediction(0, inputB); }}
                      className={`px-4 py-2 ${inputA === 0 ? 'bg-white text-black font-bold' : 'text-zinc-500 hover:text-white'}`}
                    >
                      0
                    </button>
                    <button
                      onClick={() => { setInputA(1); runPrediction(1, inputB); }}
                      className={`px-4 py-2 ${inputA === 1 ? 'bg-white text-black font-bold' : 'text-zinc-500 hover:text-white'}`}
                    >
                      1
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-500">Input B</span>
                  <div className="flex border border-white/10 rounded-none overflow-hidden font-mono text-xs">
                    <button
                      onClick={() => { setInputB(0); runPrediction(inputA, 0); }}
                      className={`px-4 py-2 ${inputB === 0 ? 'bg-white text-black font-bold' : 'text-zinc-500 hover:text-white'}`}
                    >
                      0
                    </button>
                    <button
                      onClick={() => { setInputB(1); runPrediction(inputA, 1); }}
                      className={`px-4 py-2 ${inputB === 1 ? 'bg-white text-black font-bold' : 'text-zinc-500 hover:text-white'}`}
                    >
                      1
                    </button>
                  </div>
                </div>
              </div>

              {/* Truth validation box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#090909] border border-white/[0.04] p-4 font-mono text-xs">
                <div>
                  <span className="text-zinc-500 block mb-1">Mathematical Formula Output:</span>
                  <span className="text-zinc-300">{prediction !== null ? prediction.toFixed(10) : "Untrained"}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block mb-1">Expected Output (Truth):</span>
                  <span className="text-white font-bold">{(inputA !== inputB) ? 1 : 0}</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Privacy Firewall Simulator */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* The Bouncer/DP box */}
            <div className="bg-[#0c0c0c] border border-white/[0.08] p-6 space-y-6">
              <div>
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  <Shield size={14} className="text-emerald-500" /> Edge Security Firewall
                </h3>
                <p className="text-zinc-500 text-xs mt-1">
                  Before gradient updates leave the device, secure them using differential privacy & quantization.
                </p>
              </div>

              {/* Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Laplacian Noise (ε)</span>
                  <span className="text-emerald-400 font-bold">{epsilon}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.1"
                  value={epsilon}
                  onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                  className="w-full bg-zinc-800 accent-emerald-500 h-1 rounded-full appearance-none cursor-pointer"
                />
              </div>

              <button
                onClick={handleExportSecuredGradients}
                className="w-full flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-white font-mono text-[11px] uppercase tracking-wider py-3 transition-colors"
              >
                Apply DP Noise & Export
              </button>

              {/* JSON preview of quantized weights */}
              {secureGrads && (
                <div className="space-y-2">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500 block">Exported 8-bit Payload Preview:</span>
                  <div className="bg-[#090909] border border-white/[0.04] p-3 text-[10px] font-mono text-zinc-400 max-h-40 overflow-y-auto space-y-2">
                    <div>
                      <span className="text-emerald-500">weights_ih:</span> [{secureGrads.weights_ih.data.join(', ')}]
                    </div>
                    <div>
                      <span className="text-emerald-500">weights_ho:</span> [{secureGrads.weights_ho.data.join(', ')}]
                    </div>
                    <div>
                      <span className="text-emerald-500">bias_h:</span> [{secureGrads.bias_h.data.join(', ')}]
                    </div>
                    <div>
                      <span className="text-emerald-500">bias_o:</span> [{secureGrads.bias_o.data.join(', ')}]
                    </div>
                    <div className="text-zinc-600 text-[9px] pt-1">
                      *Note: Floating point numbers are gone. Replaced with 8-bit quantized gradients to protect data.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Live Terminal Log */}
            <div className="bg-[#0c0c0c] border border-white/[0.08] p-6 space-y-4">
              <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-500 block">Wasm Console Logs</span>
              <div className="font-mono text-[11px] text-zinc-500 space-y-2 h-44 overflow-y-auto select-none bg-[#090909] border border-white/[0.04] p-4">
                {logs.length === 0 ? (
                  <div className="text-zinc-700 italic">No logs yet. Click 'Train Model' to execute steps.</div>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="leading-relaxed border-b border-white/[0.02] pb-1 last:border-0">{log}</div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
