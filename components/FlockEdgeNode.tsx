'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FlockEdgeNode() {
  const [step, setStep] = useState(0);
  const [gradient, setGradient] = useState("0.0000");

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
      if (step === 0) { // Calculate new gradient right before entering step 1
        setGradient((Math.random() * 2 - 1).toFixed(4));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [step]);

  const stages = [
    { 
      title: "1. SYNC GLOBAL STATE", 
      math: "W_t → Node_i", 
      desc: "Fetching central parameter weights",
      color: "text-blue-400",
      glow: "bg-blue-500/20"
    },
    { 
      title: "2. LOCAL SGD (WASM)", 
      math: `∇L_i = ∂Loss/∂W ≈ ${gradient}`, 
      desc: "Computing gradients via Backpropagation",
      color: "text-amber-400",
      glow: "bg-amber-500/20"
    },
    { 
      title: "3. DIFFERENTIAL PRIVACY", 
      math: `Q(∇L_i + Laplace(ε=0.5))`, 
      desc: "Injecting cryptographic noise & Quantizing",
      color: "text-fuchsia-400",
      glow: "bg-fuchsia-500/20"
    },
    { 
      title: "4. ASYNCHRONOUS UPDATE", 
      math: "W_{t+1} = W_t - η * ∇L_i", 
      desc: "Transmitting ΔW to central server",
      color: "text-emerald-400",
      glow: "bg-emerald-500/20"
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none w-[22rem]">
      <div className="bg-[#050505]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_60px_-15px_rgba(255,255,255,0.1)] relative overflow-hidden flex flex-col gap-4">
        
        {/* Dynamic Glow */}
        <div className={`absolute -top-12 -right-12 w-40 h-40 blur-3xl rounded-full transition-colors duration-1000 ${stages[step].glow}`}></div>
        
        {/* Header */}
        <div className="flex justify-between items-center z-10 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_12px_currentColor] ${stages[step].color}`} />
            <span className="font-bold text-white tracking-widest text-sm">AD-SGD ENGINE</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 border border-slate-700 px-2 py-0.5 rounded bg-slate-800/50">WASM</span>
        </div>

        {/* Math Stage Carousel */}
        <div className="relative h-28 flex flex-col justify-center z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute w-full flex flex-col gap-2"
            >
              <div className={`text-[10px] tracking-widest font-bold uppercase ${stages[step].color}`}>
                {stages[step].title}
              </div>
              <div className="font-mono text-lg text-white bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex justify-center items-center shadow-inner">
                {stages[step].math}
              </div>
              <div className="text-[10px] text-slate-500 font-mono tracking-wider truncate">
                &gt; {stages[step].desc}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Pipeline */}
        <div className="flex justify-between items-center mt-2 z-10 opacity-80">
           <div className={`w-2 h-2 rounded-full transition-all duration-500 ${step === 0 ? 'bg-blue-400 scale-125 shadow-[0_0_10px_#60a5fa]' : 'bg-slate-700'}`} />
           <div className="flex-1 h-[1px] bg-slate-800 mx-2" />
           <div className={`w-2 h-2 rounded-full transition-all duration-500 ${step === 1 ? 'bg-amber-400 scale-125 shadow-[0_0_10px_#fbbf24]' : 'bg-slate-700'}`} />
           <div className="flex-1 h-[1px] bg-slate-800 mx-2" />
           <div className={`w-2 h-2 rounded-full transition-all duration-500 ${step === 2 ? 'bg-fuchsia-400 scale-125 shadow-[0_0_10px_#e879f9]' : 'bg-slate-700'}`} />
           <div className="flex-1 h-[1px] bg-slate-800 mx-2" />
           <div className={`w-2 h-2 rounded-full transition-all duration-500 ${step === 3 ? 'bg-emerald-400 scale-125 shadow-[0_0_10px_#34d399]' : 'bg-slate-700'}`} />
        </div>
      </div>
    </div>
  );
}
