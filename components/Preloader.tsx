'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const BOOT_LOGS = [
  "INITIALIZING PORTFOLIO KERNEL V3.0...",
  "ESTABLISHING CONTEXT & POSITIONING...",
  "MOUNTING AI ENGINE & COMMERCE LOGISTICS...",
  "VERIFYING DISTRIBUTED SYSTEMS TELEMETRY...",
  "TUNING REAL-TIME INFRASTRUCTURE NODES...",
  "SYSTEM DEPLOYMENT SUCCESSFUL."
];

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [currentLogIdx, setCurrentLogIdx] = useState(0);

  useEffect(() => {
    const duration = 1200; // Total duration to boot
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const nextCount = Math.min(Math.round((step / steps) * 100), 100);
      setCount(nextCount);

      // Determine current log index based on percentage
      const logIdx = Math.min(
        Math.floor((nextCount / 100) * BOOT_LOGS.length),
        BOOT_LOGS.length - 1
      );
      setCurrentLogIdx(logIdx);

      if (step >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.98 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-white select-none scanlines"
    >
      {/* Background grain noise */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40" />

      {/* Decorative Grid */}
      <div className="absolute inset-0 grid-bg-subtle opacity-30 pointer-events-none" />

      {/* Center Dashboard */}
      <div className="relative w-full max-w-xl px-6 md:px-12 z-10 flex flex-col justify-between h-[360px]">
        {/* Top Header */}
        <div className="flex justify-between items-start font-mono text-[10px] tracking-[0.2em] text-[#FF3B30] uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#FF3B30] rounded-full animate-ping" />
            <span>[ SYSTEM_INIT ]</span>
          </div>
          <span>LOC: KOLKATA // PORT: 443</span>
        </div>

        {/* Big Counter */}
        <div className="my-auto">
          <div className="flex justify-between items-baseline font-mono border-b border-white/5 pb-4">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">{"// ARCHITECTURE_BOOT_SEQ"}</span>
            <span className="text-7xl md:text-9xl font-bold leading-none tracking-tighter text-white font-sans tabular-nums red-text-glow">
              {count.toString().padStart(3, '0')}<span className="text-xs text-[#FF3B30] font-mono">%</span>
            </span>
          </div>

          {/* Sequential Logs */}
          <div className="h-10 mt-6 font-mono text-xs text-gray-400 uppercase tracking-wider overflow-hidden">
            <div className="flex flex-col gap-1">
              <span className="text-gray-600 font-bold">&gt;&gt; {BOOT_LOGS[currentLogIdx]}</span>
              {currentLogIdx > 0 && (
                <span className="text-[10px] text-gray-700 select-none">
                  PREV: {BOOT_LOGS[currentLogIdx - 1]}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar & Footer */}
        <div className="space-y-4">
          <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-[#FF3B30]"
              initial={{ width: "0%" }}
              animate={{ width: `${count}%` }}
              transition={{ duration: 0.1 }}
              style={{ boxShadow: '0 0 10px #FF3B30' }}
            />
          </div>

          <div className="flex justify-between font-mono text-[10px] text-gray-500 uppercase tracking-widest">
            <span>SECURE_BOOT_COMPLETED</span>
            <span>V3.0.0 [PROD]</span>
          </div>
        </div>
      </div>

      {/* Aesthetic Border Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#FF3B30]/5 via-transparent to-[#FF3B30]/5 blur-[120px] pointer-events-none" />
    </motion.div>
  );
}
