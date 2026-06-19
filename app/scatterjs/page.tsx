"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

export default function ScatterTeaserPage() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState('');
  const [gpuExperience, setGpuExperience] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const [vision, setVision] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState('');

  // Blinking cursor effect for loading
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const submitWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setLoading(true);
    
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, details: `Role: ${role} | GPU: ${gpuExperience} | Pain: ${painPoint} | Vision: ${vision}` })
      });
      if (res.ok) {
        setStep(6);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const OptionButton = ({ text, onClick }: { text: string, onClick: () => void }) => (
    <button
      onClick={onClick}
      className="w-full bg-[#111] border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all text-white font-medium py-3 sm:py-4 rounded-xl text-base sm:text-lg flex items-center justify-between px-4 sm:px-6 group"
    >
      <span className="text-left">{text}</span>
      <ArrowRight size={20} className="text-[#555] group-hover:text-emerald-500 transition-colors flex-shrink-0 ml-4" />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E5E5] font-sans selection:bg-[#FF3B30] selection:text-white flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none transition-opacity duration-1000"></div>

      <AnimatePresence mode="wait">
        
        {/* STEP 0: Role */}
        {step === 0 && (
          <motion.div key="step-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="relative z-10 max-w-2xl text-center space-y-8 sm:space-y-10 w-full">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Before we begin, what best describes you?
            </h1>
            <div className="flex flex-col space-y-3 sm:space-y-4 max-w-md mx-auto w-full">
              <OptionButton text="Startup Founder" onClick={() => { setRole('Founder'); setStep(1); }} />
              <OptionButton text="Senior Engineer" onClick={() => { setRole('Senior'); setStep(1); }} />
              <OptionButton text="Junior Dev / Student" onClick={() => { setRole('Junior/Student'); setStep(1); }} />
              <OptionButton text="Just exploring AI" onClick={() => { setRole('Explorer'); setStep(1); }} />
            </div>
          </motion.div>
        )}

        {/* STEP 1: GPU Experience */}
        {step === 1 && (
          <motion.div key="step-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="relative z-10 max-w-2xl text-center space-y-8 sm:space-y-10 w-full">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Have you ever tried to train an AI model locally?
            </h1>
            <div className="flex flex-col space-y-3 sm:space-y-4 max-w-md mx-auto w-full">
              <OptionButton text="Yes, my laptop sounded like a jet engine" onClick={() => { setGpuExperience('Laptop caught fire'); setStep(2); }} />
              <OptionButton text="No, I rent expensive cloud GPUs" onClick={() => { setGpuExperience('Rents Cloud'); setStep(2); }} />
              <OptionButton text="I use free Colab tiers" onClick={() => { setGpuExperience('Colab'); setStep(2); }} />
              <OptionButton text="Not yet, it seems too complex" onClick={() => { setGpuExperience('Not yet'); setStep(2); }} />
            </div>
          </motion.div>
        )}

        {/* STEP 2: Pain Point */}
        {step === 2 && (
          <motion.div key="step-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="relative z-10 max-w-2xl text-center space-y-8 sm:space-y-10 w-full">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              What is the biggest barrier in AI development right now?
            </h1>
            <div className="flex flex-col space-y-3 sm:space-y-4 max-w-md mx-auto w-full">
              <OptionButton text="Absurd AWS / Cloud costs" onClick={() => { setPainPoint('Costs'); setStep(3); }} />
              <OptionButton text="Data Privacy & Extraction risks" onClick={() => { setPainPoint('Privacy'); setStep(3); }} />
              <OptionButton text="Complicated infrastructure setup" onClick={() => { setPainPoint('Complexity'); setStep(3); }} />
              <OptionButton text="Hardware limitations" onClick={() => { setPainPoint('Hardware'); setStep(3); }} />
            </div>
          </motion.div>
        )}

        {/* STEP 3: The Vision */}
        {step === 3 && (
          <motion.div key="step-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="relative z-10 max-w-2xl text-center space-y-8 sm:space-y-10 w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              Imagine if every single person who visited your website unknowingly lent you their laptop&apos;s GPU power. What would you do?
            </h1>
            <div className="flex flex-col space-y-3 sm:space-y-4 max-w-md mx-auto w-full">
              <OptionButton text="Train massive models for free" onClick={() => { setVision('Train Models'); setStep(4); }} />
              <OptionButton text="Process crazy amounts of data" onClick={() => { setVision('Process Data'); setStep(4); }} />
              <OptionButton text="Build the next ChatGPT" onClick={() => { setVision('Next ChatGPT'); setStep(4); }} />
              <OptionButton text="Just flex on Twitter" onClick={() => { setVision('Flex'); setStep(4); }} />
            </div>
          </motion.div>
        )}

        {/* STEP 4: The Hook */}
        {step === 4 && (
          <motion.div key="step-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }} className="relative z-10 max-w-3xl text-center space-y-8 sm:space-y-10 px-2 sm:px-0">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
              What if you could harness this distributed compute power for exactly <span className="text-emerald-500">$0</span>, using just JavaScript?
            </h1>
            <button
              onClick={() => setStep(5)}
              className="bg-white text-black font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)] w-full sm:w-auto"
            >
              Show me how
            </button>
          </motion.div>
        )}

        {/* STEP 5: The Cinematic Teaser & Form */}
        {step === 5 && (
          <motion.div key="step-5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative z-10 flex flex-col items-center text-center w-full max-w-md px-2 sm:px-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#0A0A0A] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-6 sm:mb-8">
              <Terminal size={24} className="text-emerald-500 sm:w-7 sm:h-7" />
            </div>

            <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white">Scatter.js</h1>
              <p className="text-base sm:text-lg text-[#A1A1A1] font-light tracking-widest uppercase">Decentralizing AI</p>
            </div>

            <div className="w-full bg-[#111] border border-white/10 p-5 sm:p-8 rounded-2xl shadow-2xl">
              <div className="flex justify-center mb-5 sm:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-3 text-emerald-500 font-mono text-[10px] sm:text-xs tracking-widest uppercase bg-emerald-500/10 border border-emerald-500/20 px-3 sm:px-4 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Live in 48 Hours</span>
                </div>
              </div>

              <form onSubmit={submitWaitlist} className="space-y-3 sm:space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] sm:text-xs font-medium text-[#888] ml-1">Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Satoshi Nakamoto" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] sm:text-xs font-medium text-[#888] ml-1">Email</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="satoshi@bitcoin.org" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-white text-black font-bold py-3 sm:py-3.5 text-sm sm:text-base rounded-lg hover:bg-gray-200 transition-colors mt-2 flex justify-center items-center">
                  {loading ? <Loader2 size={18} className="animate-spin sm:w-5 sm:h-5" /> : "Request Early Access"}
                </button>
              </form>
            </div>
            <div className="text-[#555] font-mono text-[10px] sm:text-xs flex justify-center space-x-1 mt-6 sm:mt-8">
              <span>Compiling infrastructure</span>
              <span className="w-4 text-left">{dots}</span>
            </div>
          </motion.div>
        )}

        {/* STEP 6: Success */}
        {step === 6 && (
          <motion.div key="step-6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 flex flex-col items-center text-center space-y-4 sm:space-y-6 max-w-lg px-4 sm:px-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-500 mb-2 sm:mb-4">
              <CheckCircle2 size={32} className="sm:w-10 sm:h-10" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">You&apos;re on the list.</h1>
            <p className="text-base sm:text-lg text-[#A1A1A1] leading-relaxed">
              We have secured your spot for the early access launch. Keep an eye on your inbox, we will be sending the repository link in exactly 48 hours.
            </p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
