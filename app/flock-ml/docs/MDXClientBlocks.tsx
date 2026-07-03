"use client";

import React from 'react';
import { useMode } from './ModeContext';
import { motion, AnimatePresence } from 'framer-motion';

export function EngineerBlock({ children }: { children: React.ReactNode }) {
  const { isJuniorMode } = useMode();
  
  if (isJuniorMode) return null;
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="engineer"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function JuniorBlock({ children }: { children: React.ReactNode }) {
  const { isJuniorMode } = useMode();
  
  if (!isJuniorMode) return null;
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="junior"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.3 }}
        className="bg-[#111] p-6 rounded-xl border border-blue-500/20 shadow-[0_0_30px_-10px_rgba(59,130,246,0.15)] my-6"
      >
        <div className="flex items-center space-x-2 mb-4 border-b border-white/5 pb-3">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Junior Dev Translation</span>
        </div>
        <div className="space-y-4">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
